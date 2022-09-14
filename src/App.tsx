/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useContext, useEffect, useRef,
} from 'react';

import classNames from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import {
  getTodos, deleteTodo, postTodo, patchTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editing, setEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(0);
  const [filter, setFilter] = useState(Filter.all);
  const [isError, setIsError] = useState(false);
  const [errorTitle, setErroTitle] = useState('');

  const completedTodos = todos?.filter(todo => todo.completed);
  const activeTodos = todos?.filter(todo => !todo.completed);
  const allTodosCompleted = todos?.every(todo => todo.completed);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [editedTitle]);

  const showError = (text: string) => {
    setIsError(true);
    setErroTitle(text);

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (user) {
          const result = await getTodos(user.id);

          setTodos(result);
        }
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, [user]);

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodosId(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      if (user) {
        const result = await getTodos(user.id);

        setTodos(result);
      }

      setLoadingTodosId(prev => prev.filter(id => id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    }
  };

  const showNewTodoField = (newTodo: Omit<Todo, 'id'>) => {
    const newField = {
      ...newTodo,
      id: todos.length + 1,
    };

    setTodos(prev => [...prev, newField]);
    setLoadingTodosId(prev => [...prev, newField.id]);
  };

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      showError('Title can\'t be empty');

      return;
    }

    try {
      if (user) {
        const newTodo: Omit<Todo, 'id'> = {
          userId: user.id,
          title,
          completed: false,
        };

        showNewTodoField(newTodo);

        await postTodo(newTodo);
        const result = await getTodos(user.id);

        setTitle('');
        setTodos(result);

        return;
      }
    } catch {
      showError('Unable to add a todo');
    }
  };

  const updateTodo = async (todoId: number, data: Partial<Todo>) => {
    try {
      setLoadingTodosId(prev => [...prev, todoId]);

      await patchTodo(todoId, data);

      if (user) {
        const result = await getTodos(user.id);

        setTodos(result);
      }

      setLoadingTodosId(prev => prev.filter(id => id !== todoId));
    } catch {
      showError('Unable to update a todo');
    }
  };

  const toggleTodoStatus = (todo: Todo) => {
    const data = {
      completed: !todo.completed,
    };

    updateTodo(todo.id, data);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') {
      setEditedTitle(title);
      setEditingTodoId(0);
    }
  };

  const handleDblClick = (todo: Todo) => {
    setEditing(true);
    setEditedTitle(todo.title);
    setEditingTodoId(todo.id);
  };

  const submitEditingForm = (event: React.FormEvent, todo: Todo) => {
    event.preventDefault();

    if (editedTitle.trim() === todo.title) {
      setEditing(false);

      return;
    }

    if (!editedTitle) {
      setEditing(false);
      removeTodo(editingTodoId);

      return;
    }

    const data = {
      title: editedTitle.trim(),
    };

    updateTodo(editingTodoId, data);
    setEditing(false);
  };

  const getOpacityValue = () => {
    if (completedTodos) {
      return completedTodos.length > 0 ? 1 : 0;
    }

    return 0;
  };

  const removeCompletedTodos = () => {
    if (completedTodos) {
      completedTodos.forEach(async (todo) => {
        await removeTodo(todo.id);
      });
    }
  };

  const getDisplayValue = (todo: Todo) => {
    if (filter === Filter.active && todo.completed) {
      return 'none';
    }

    if (filter === Filter.completed && !todo.completed) {
      return 'none';
    }

    return 'grid';
  };

  const getDataForToggleAll = (todo: Todo) => {
    if (completedTodos.length > 0 && completedTodos.length !== todos.length) {
      const data = {
        completed: true,
      };

      return data;
    }

    const data = {
      completed: !todo.completed,
    };

    return data;
  };

  const toggleAll = () => {
    if (todos.length > 0) {
      todos.forEach(async (todo) => {
        try {
          const data = getDataForToggleAll(todo);

          if (todo.completed !== data.completed) {
            setLoadingTodosId(prev => [...prev, todo.id]);
          }

          await patchTodo(todo.id, data);
        } catch {
          showError('Unable to update todo');
        } finally {
          if (user) {
            const result = await getTodos(user.id);

            setTodos(result);
          }

          setLoadingTodosId(prev => prev.filter(id => id !== todo.id));
        }
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              onClick={toggleAll}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {todos.map(todo => {
                return (
                  <div
                    data-cy="Todo"
                    key={todo.id}
                    className={classNames('todo', {
                      completed: todo.completed,
                    })}
                    style={{ display: getDisplayValue(todo) }}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        defaultChecked={todo.completed}
                        onChange={() => toggleTodoStatus(todo)}
                      />
                    </label>

                    {editing && editingTodoId === todo.id ? (
                      <form
                        onSubmit={(event) => submitEditingForm(event, todo)}
                      >
                        <input
                          data-cy="TodoTitleField"
                          type="text"
                          ref={newTodoField}
                          className="todo__title-field"
                          placeholder="Empty todo will be deleted"
                          value={editedTitle}
                          onChange={(event) => {
                            setEditedTitle(event.target.value);
                          }}
                          onKeyDown={(event) => {
                            handleKeyDown(event);
                          }}
                          onBlur={(event) => submitEditingForm(event, todo)}
                        />
                      </form>
                    ) : (
                      <>
                        <span
                          data-cy="TodoTitle"
                          className="todo__title"
                          onDoubleClick={() => handleDblClick(todo)}
                        >
                          {todo.title}
                        </span>
                        <button
                          type="button"
                          className="todo__remove"
                          data-cy="TodoDeleteButton"
                          onClick={() => removeTodo(todo.id)}
                        >
                          ×
                        </button>
                      </>
                    )}

                    <div
                      data-cy="TodoLoader"
                      className={classNames('modal overlay', {
                        'is-active': loadingTodosId.includes(todo.id),
                      })}
                    >
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>

                  </div>
                );
              })}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos?.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === Filter.all,
                  })}
                  onClick={() => {
                    setFilter(Filter.all);
                  }}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === Filter.active,
                  })}
                  onClick={() => {
                    setFilter(Filter.active);
                  }}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === Filter.completed,
                  })}
                  onClick={() => {
                    setFilter(Filter.completed);
                  }}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                style={{ opacity: getOpacityValue() }}
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorTitle}
      </div>
    </div>
  );
};
