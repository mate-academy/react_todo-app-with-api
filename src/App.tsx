/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  postTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setError(ErrorTypes.LoadTodos);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos().then(() => {
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setIsErrorVisible(true);
      const timer = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editFieldRef.current?.focus();
    }
  }, [editingTodoId]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorTypes.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsLoading(true);

    try {
      const createdTodo = await postTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setTitle('');
    } catch {
      setError(ErrorTypes.AddTodo);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorTypes.DeleteTodo);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    setTempTodo(null);

    try {
      const results = await Promise.allSettled(
        completed.map(todo => deleteTodo(todo.id)),
      );

      const successfulIds = completed
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      const failed = results.some(result => result.status === 'rejected');

      if (failed) {
        setError(ErrorTypes.DeleteTodo);
      }

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleToggleCompleted = async (todo: Todo) => {
    const { id, completed } = todo;

    setLoadingTodoIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, { completed: !completed });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setError(ErrorTypes.UpdateTodo);
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = async () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    setLoadingTodoIds(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    try {
      const results = await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: shouldCompleteAll }),
        ),
      );

      const successfulIds = todosToUpdate
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prev =>
        prev.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: shouldCompleteAll }
            : todo,
        ),
      );

      const failed = results.some(result => result.status === 'rejected');

      if (failed) {
        setError(ErrorTypes.UpdateTodo);
      }
    } finally {
      setLoadingTodoIds(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const handleStartEdit = (id: number, currentTitle: string) => {
    setEditingTodoId(id);
    setEditingTitle(currentTitle);
  };

  const handleUpdateTitle = async (todo: Todo, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    setLoadingTodoIds(prev => [...prev, todo.id]);

    if (!trimmedTitle) {
      await handleDeleteTodo(todo.id);

      return;
    }

    try {
      const updatedTodo = await updateTodo(todo.id, { title: trimmedTitle });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(ErrorTypes.UpdateTodo);
    } finally {
      setEditingTodoId(null);
      setEditingTitle('');
      setLoadingTodoIds(prev => prev.filter(id => id != todo.id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={
                todos.every(t => t.completed)
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`
                    todo
                    ${todo.completed ? 'completed' : ''}
                    ${editingTodoId === todo.id ? 'editing' : ''}
                  `}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(todo)}
                      disabled={loadingTodoIds.includes(todo.id)}
                    />
                  </label>

                  {editingTodoId === todo.id ? (
                    <input
                      ref={editFieldRef}
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      value={editingTitle}
                      autoFocus
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={e => handleUpdateTitle(todo, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleUpdateTitle(todo, e.currentTarget.value);
                        }

                        if (e.key === 'Escape') {
                          setEditingTodoId(null);
                          setEditingTitle(todo.title);
                          inputRef.current?.focus();
                        }
                      }}
                    />
                  ) : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        if (!loadingTodoIds.includes(todo.id)) {
                          handleStartEdit(todo.id, todo.title);
                        }
                      }}
                    >
                      {todo.title}
                    </span>
                  )}

                  {editingTodoId !== todo.id && (
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      loadingTodoIds.includes(todo.id) ? 'is-active' : ''
                    }`}
                  >
                    <div
                      className={'modal-background has-background-white-ter'}
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={false}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${isLoading ? 'is-active' : ''}`}
                  >
                    <div
                      className={'modal-background has-background-white-ter'}
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedCount}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!isErrorVisible ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError(null);
            setIsErrorVisible(false);
          }}
        />
        {error}
      </div>
    </div>
  );
};
