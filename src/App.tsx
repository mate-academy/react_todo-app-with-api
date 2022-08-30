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
  const [newTitle, setNewTitle] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changedTodosId, setChangedTodosId] = useState<number[]>([]);
  const [filteredBy, setFilteredBy] = useState<string | null>(null);

  // ** Error handler ** //
  const onError = useCallback((errorTitle: string) => {
    setErrorMessage(errorTitle);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  // ++ Array length only with active todo, created for counter active todo in footer ** //
  const lengthActive = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  // ** Array length only with completed todo, created for showing clear button ** //
  const lengthCompleted = useMemo(() => (
    todos.length - lengthActive
  ), [todos, lengthActive]);

  // ** request to the server to get all todos ** //
  useEffect(() => {
    if (user) {
      setErrorMessage('');

      getTodos(user.id)
        .then(res => {
          setTodos(res);
        })
        .catch(onError)
        .finally(() => {
          setShouldUpdate(false);
          setChangedTodosId([]);
        });
    }
  }, [user, shouldUpdate]);

  // ** filtering todo when click on button in footer ** //
  const filteredTodos = useMemo(() => {
    switch (filteredBy) {
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      case 'All':
      default:
        return todos;
    }
  }, [filteredBy, todos]);

  // ** as soon as start the application immediately focuses on the newTodoField ** //
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  // ** creating new todo and sending it to the server ** //
  const addTodo = useCallback(() => {
    if (!newTitle.trim()) {
      onError('Title can\'t be empty');
      setIsSubmit(false);

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
          setIsSubmit(false);
        });
    }
  }, [isSubmit]);

  // ** deleting todo by id ** //
  const removeTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setTodos(prev => (
            prev.filter(todo => todo.id !== todoId)
          ));
        }
      })
      .catch(() => onError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  }, []);

  // ** updating todo field like completed or title by id ** //
  const updateTodo = useCallback(
    (todoId: number, data: {}) => {
      setSelectedTodoId(todoId);
      setIsLoading(true);

      updateTodoById(todoId, data)
        .then(res => setTodos(prev => (
          prev.map(todo => {
            if (todo.id === res.id) {
              return res;
            }

            return todo;
          })
        )))
        .catch(() => onError('Unable to update a todo'))
        .finally(() => {
          setIsLoading(false);
        });
    }, [],
  );

  // ** toggle all todo completed or uncompleted **//
  const toggleAllTodo = useCallback(() => {
    const changedTodoId: number[] = [];
    const toggled = todos.some(todo => !todo.completed);

    if (toggled) {
      todos.forEach(todo => {
        if (!todo.completed) {
          changedTodoId.push(todo.id);
        }
      });
    } else {
      todos.forEach(todo => {
        changedTodoId.push(todo.id);
      });
    }

    const requests = changedTodoId.map(id => (
      updateTodoById(id, { completed: toggled })
    ));

    setSelectedTodoId(null);
    setChangedTodosId(changedTodoId);
    setIsLoading(true);

    Promise.all(requests)
      .then((res) => setTodos(prev => (
        prev.map(todo => {
          if (changedTodoId.includes(todo.id)) {
            const newTodo = res.find(resTodo => resTodo.id === todo.id);

            return newTodo || todo;
          }

          return todo;
        })
      )))
      .catch(() => onError('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setChangedTodosId([]);
      });
  }, [todos]);

  // ** clear all completed todo ** //
  const clearCompleted = useCallback(() => {
    const changedTodoId: number[] = [];

    todos.forEach(todo => {
      if (todo.completed) {
        changedTodoId.push(todo.id);
      }
    });

    const requests = changedTodoId.map(id => deleteTodo(id));

    setSelectedTodoId(null);
    setChangedTodosId(changedTodoId);
    setIsLoading(true);

    Promise.all(requests)
      .then(() => setTodos(prev => (
        prev.filter(todo => !changedTodoId.includes(todo.id))
      )))
      .catch(() => onError('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setChangedTodosId([]);
      });
  }, [todos]);

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSubmit(true);
                }
              }}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={removeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
          changedTodosId={changedTodosId}
        />

        {todos.length > 0 && (
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
