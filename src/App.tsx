/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  createTodo, deleteTodo, getTodos, updateTodoById,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changedTodosId, setChangedTodosId] = useState<number[]>([]);
  const [filteredBy, setFilteredBy] = useState<string | null>(null);

  const onError = useCallback((errorTitle: string) => {
    setErrorMessage(errorTitle);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const lengthActive = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const lengthCompleted = useMemo(() => (
    todos.length - lengthActive
  ), [todos, lengthActive]);

  useEffect(() => {
    if (user) {
      setErrorMessage('');
      setIsLoading(true);

      getTodos(user.id)
        .then(res => {
          setTodos(res);
          setTodosFromServer(res);
        })
        .catch(onError)
        .finally(() => {
          setShouldUpdate(false);
          setChangedTodosId([]);
          setIsLoading(false);
        });
    }
  }, [user, errorMessage, shouldUpdate]);

  useEffect(() => {
    switch (filteredBy) {
      case 'Active':
        setTodos(todosFromServer.filter(todo => !todo.completed));

        break;
      case 'Completed':
        setTodos(todosFromServer.filter(todo => todo.completed));

        break;
      case 'All':
      default:
        setTodos(todosFromServer);

        break;
    }
  }, [filteredBy]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addTodo = () => {
    if (!newTitle) {
      onError('Title can\'t be empty');

      return;
    }

    if (user) {
      const newTodo = {
        id: -Infinity,
        userId: user.id,
        title: newTitle,
        completed: false,
      };

      setSelectedTodoId(newTodo.id);
      setIsLoading(true);
      setTodos(prev => [...prev, newTodo]);
      createTodo(newTitle, user.id, false)
        .then((res) => {
          setTodos(prev => prev
            .map(todo => {
              const result = todo;

              if (todo === newTodo) {
                result.id = res.id;
              }

              return result;
            }));
          setSelectedTodoId(res.id);
        })
        .catch(() => {
          setTodos(prev => prev.slice(0, -1));
          onError('Unable to add a todo');
        })
        .finally(() => {
          setNewTitle('');
          setIsLoading(false);
        });
    }
  };

  const removeTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setShouldUpdate(true);
        }
      })
      .catch(() => onError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (todoId: number, data: {}) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);

    updateTodoById(todoId, data)
      .then(() => setShouldUpdate(true))
      .catch(() => onError('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleAllTodo = () => {
    const changedTodoId: number[] = [];

    if (todos.some(todo => !todo.completed)) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodo(todo.id, { completed: true });
          changedTodoId.push(todo.id);
        }
      });
    } else {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false });
        changedTodoId.push(todo.id);
      });
    }

    setSelectedTodoId(null);
    setChangedTodosId(changedTodoId);
  };

  const clearCompleted = () => {
    const changedTodoId: number[] = [];

    todos.forEach(todo => {
      if (todo.completed) {
        changedTodoId.push(todo.id);
      }
    });

    setChangedTodosId(changedTodoId);

    todos.forEach(todo => todo.completed && removeTodo(todo.id));
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
              className="todoapp__toggle-all active"
              onClick={toggleAllTodo}
            />
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={removeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
          changedTodosId={changedTodosId}
        />

        {(todos.length > 0 || (!todos.length && filteredBy !== 'All')) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${lengthActive} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={(classNames(
                  'filter__link',
                  { selected: filteredBy === 'All' },
                ))}
                onClick={() => setFilteredBy('All')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={(classNames(
                  'filter__link',
                  { selected: filteredBy === 'Active' },
                ))}
                onClick={() => setFilteredBy('Active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={(classNames(
                  'filter__link',
                  { selected: filteredBy === 'Completed' },
                ))}
                onClick={() => setFilteredBy('Completed')}
              >
                Completed
              </a>
            </nav>

            {lengthCompleted > 0 ? (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            ) : (
              <button
                type="button"
                className="todoapp__clear-completed"
                style={{ opacity: 0, cursor: 'auto' }}
                disabled
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />

          {errorMessage}
        </div>
      )}
    </div>
  );
};
