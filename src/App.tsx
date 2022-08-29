/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  deleteTodos, getTodos, patchTodos, postTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

type FilteredTodos = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const userId = user?.id || 0;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [trigger, setTriger] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [changedTodoTitle, setChangedTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHiddenTodoChange, setIsHiddenTodoChange] = useState(false);
  const [filterType, setFilterType] = useState<FilteredTodos>('all');
  const [todoId, setTodoId] = useState(0);
  const [error, setErorr] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then(setTodos)
        .finally(() => {
          setIsLoading(false);
          setIsHiddenTodoChange(false);
        });
    }
  }, [userId, trigger]);

  const changeError = (newError: string) => {
    setErorr(newError);
    setTimeout(() => {
      setErorr('');
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim().length === 0) {
      changeError('empty');

      return;
    }

    if (newTodoTitle.trim().length > 0) {
      postTodos({
        userId,
        title: newTodoTitle,
        completed: false,
      }).catch(() => changeError('addError'))
        .finally(() => {
          setNewTodoTitle('');
          setTriger(prev => !prev);
        });
    }
  };

  const handleChangeTodos = (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    event.preventDefault();

    if ((todo.title !== changedTodoTitle)
                      && (changedTodoTitle.length !== 0)) {
      setIsLoading(prev => !prev);
      patchTodos(todo.id, { title: changedTodoTitle })
        .then(() => {
          setTriger(prev => !prev);
        })
        .catch(() => changeError('patchError'));
    } else if (changedTodoTitle.length === 0) {
      setIsLoading(prev => !prev);
      deleteTodos(todo.id)
        .then(() => setTriger(prev => !prev))
        .catch(() => changeError('deleteError'));
    } else {
      setIsHiddenTodoChange(false);
    }
  };

  const getFilteredTodos = useCallback((filteredType: FilteredTodos) => {
    switch (filteredType) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos]);

  const filteredTodos = getFilteredTodos(filterType);
  const activeTodos = getFilteredTodos('active');
  const completedTodos = getFilteredTodos('completed');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={todo.completed
                ? 'todo completed'
                : 'todo'}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() => {
                    setIsLoading(prev => !prev);
                    setTodoId(todo.id);
                    patchTodos(todo.id, { completed: !todo.completed })
                      .then(() => {
                        setTriger(prev => !prev);
                      })
                      .catch(() => changeError('patchError'));
                  }}
                />

              </label>

              {isHiddenTodoChange && todo.id === todoId && !todo.completed
                ? (
                  <form
                    onSubmit={(e) => handleChangeTodos(e, todo)}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={changedTodoTitle}
                      onChange={(event) => {
                        setChangedTodoTitle(event.target.value);
                      }}
                    />
                  </form>
                )
                : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setTodoId(todo.id);
                      setIsHiddenTodoChange(true);
                      setChangedTodoTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                )}

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => {
                  setTodoId(todo.id);
                  setIsLoading(prev => !prev);
                  deleteTodos(todo.id)
                    .then(() => setTriger(prev => !prev))
                    .catch(() => changeError('deleteError'));
                }}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={
                  classNames('modal', 'overlay',
                    {
                      'is-active':
                    ((todo.id === todoId && isLoading)
                    || (isLoading && completedTodos.includes(todo))),
                    })
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/all"
                className={filterType === 'all'
                  ? 'filter__link selected'
                  : 'filter__link'}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterType('all');
                }}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={filterType === 'active'
                  ? 'filter__link selected'
                  : 'filter__link'}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterType('active');
                }}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={filterType === 'completed'
                  ? 'filter__link selected'
                  : 'filter__link'}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterType('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              hidden={completedTodos.length === 0}
              onClick={() => {
                todos.forEach((todo) => {
                  if (todo.completed) {
                    setIsLoading(true);
                    deleteTodos(todo.id)
                      .then(() => setTriger(prev => !prev))
                      .catch(() => changeError('deleteError'));
                  }
                });
              }}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      {error.length > 0
      && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErorr('')}
          />

          {error === 'empty' && 'Title can\'t be empty'}
          {error === 'addError' && 'Unable to add a todo'}
          {error === 'deleteError' && 'Unable to delete a todo'}
          {error === 'patchError' && 'Unable to update a todo'}

        </div>
      )}
    </div>
  );
};
