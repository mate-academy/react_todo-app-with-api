import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Errors, Filter } from './types/enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterMethod, setFilterMethod] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const [addingTodo, setAddingTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<number | null>(null);
  const [deleteTodosId, setDeletingTodosId] = useState<number[]>([]);
  const [updatingTodoId, setUpdatingTodoId] = useState<number[]>([]);
  const [toggleAllLoading, setToggleAllLoading] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId !== null && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [editingTodoId]);

  const getFilteredTodos = (tod: Todo[], query: string): Todo[] => {
    let filteredTodo = [...tod];

    switch (query) {
      case Filter.Active:
        filteredTodo = filteredTodo.filter(todo => todo.completed === false);
        break;
      case Filter.Completed:
        filteredTodo = filteredTodo.filter(todo => todo.completed === true);
        break;
    }

    return filteredTodo;
  };

  useEffect(() => {
    const loadTodo = async () => {
      try {
        const todo = await getTodos();

        setTodos(todo);
      } catch (error) {
        setErrorMessage(Errors.Load);
      }
    };

    loadTodo();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.Empty);

      return;
    }

    const newTodo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setAddingTodo(newTodo);

    try {
      const addedTodo = await addTodos(newTodo);

      setTodos(prev => [...prev, addedTodo]);

      setTitle('');
    } catch (e) {
      setErrorMessage(Errors.Add);
    } finally {
      setAddingTodo(null);

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setDeleteTodo(todoId);
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (e) {
      setErrorMessage(Errors.Delete);
    } finally {
      setDeleteTodo(null);

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeletingCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedId = completedTodos.map(todo => todo.id);

    setDeletingTodosId(id => [...id, ...completedId]);

    try {
      const result = await Promise.allSettled(completedId.map(deleteTodos));
      const successId = completedTodos
        .filter((todo, index) => result[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (result.some(a => a.status === 'rejected')) {
        setErrorMessage(Errors.Delete);
      }

      if (successId.length > 0) {
        setTodos(t => t.filter(todo => !successId.includes(todo.id)));
      }
    } catch (e) {
      setErrorMessage(Errors.Delete);
    } finally {
      setDeletingTodosId(prev => prev.filter(id => !completedId.includes(id)));

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

  const todoToRender = addingTodo ? [...todos, addingTodo] : todos;
  const filteredTodo = getFilteredTodos(todoToRender, filterMethod);
  const itemsLeft = todos.filter(todo => todo.completed === false);
  const isAllTodosCompleted = todos.every(
    todo => todos.length > 0 && todo.completed,
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getTodoLoaderClass = (todo: Todo) => {
    return classNames('modal overlay', {
      'is-active':
        deleteTodosId.includes(todo.id) ||
        todo.id === 0 ||
        todo.id === deleteTodo ||
        updatingTodoId.includes(todo.id) ||
        toggleAllLoading ||
        (todo.id === editingTodoId && updatingTodoId.includes(todo.id)),
    });
  };

  const handleUpdateTodo = async (todo: Todo) => {
    setUpdatingTodoId(prev => [...prev, todo.id]);

    try {
      await updateTodos(todo.id, { completed: !todo.completed });

      setTodos(currentTodos =>
        currentTodos.map(t =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch (e) {
      setErrorMessage(Errors.Update);
    } finally {
      setUpdatingTodoId(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    setToggleAllLoading(true);
    setUpdatingTodoId(todos.map(todo => todo.id));
    const targetStatus = !isAllTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);
    const updatePromises = todosToUpdate.map(todo =>
      updateTodos(todo.id, { completed: targetStatus }),
    );

    try {
      const results = await Promise.allSettled(updatePromises);

      const successfulUpdates = todosToUpdate.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage(Errors.Update);
      }

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updatedTodo = successfulUpdates.find(s => s.id === todo.id);

          return updatedTodo ? { ...todo, completed: targetStatus } : todo;
        }),
      );
    } catch (error) {
      setErrorMessage(Errors.Update);
    } finally {
      setToggleAllLoading(false);
      setUpdatingTodoId([]);
    }
  };

  const handleRenameTodo = async (todo: Todo) => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setUpdatingTodoId(prev => [...prev, todo.id]);

    try {
      await updateTodos(todo.id, { title: trimmedTitle });

      setTodos(currentTodos =>
        currentTodos.map(t =>
          t.id === todo.id ? { ...t, title: trimmedTitle } : t,
        ),
      );
      setEditingTodoId(null);
    } catch (e) {
      setErrorMessage(Errors.Update);
    } finally {
      setUpdatingTodoId(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditedTitle('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
              disabled={todos.length === 0 || toggleAllLoading}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              ref={titleRef}
              value={title}
              autoFocus
              onChange={event => setTitle(event.target.value)}
              disabled={addingTodo !== null}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}

          {filteredTodo.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
                editing: todo.id === editingTodoId,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  aria-label="Mark todo"
                  onChange={() => handleUpdateTodo(todo)}
                />
              </label>

              {todo.id === editingTodoId ? (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleRenameTodo(todo);
                  }}
                >
                  <input
                    ref={editFieldRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editedTitle}
                    onChange={event => setEditedTitle(event.target.value)}
                    onBlur={() => handleRenameTodo(todo)}
                    onKeyUp={event => {
                      if (event.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
                    setEditedTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )}

              {todo.id !== editingTodoId && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
              )}

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className={getTodoLoaderClass(todo)}>
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterMethod === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterMethod(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterMethod === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterMethod(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filterMethod === Filter.Completed,
                })}
                onClick={() => setFilterMethod(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeletingCompleted}
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
