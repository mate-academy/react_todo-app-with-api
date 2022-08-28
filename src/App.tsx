/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './components/Todo';
import { Todo as TodoType } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodoField, setNewTodoField] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const changeError = (newError: string) => {
    setError(newError);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id).then(response => setTodos(response));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.length && todos.every(todo => todo.completed),
                },
              )}
              onClick={() => {
                const toggler = todos.length
                  && todos.every(todo => todo.completed);

                setTodos(todos.map(currentTodo => {
                  if (currentTodo.completed === toggler) {
                    return {
                      ...currentTodo,
                      loading: true,
                    };
                  }

                  return { ...currentTodo };
                }));

                const promises: Promise<TodoType>[] = [];

                todos.forEach(currentTodo => {
                  if (currentTodo.completed === toggler) {
                    promises
                      .push(updateTodo(currentTodo.id, !toggler));
                  }
                });

                Promise.all(promises).then(() => setTodos(todos
                  .map(currentTodo => {
                    if (currentTodo.completed === toggler) {
                      return {
                        ...currentTodo,
                        completed: !toggler,
                        loading: false,
                      };
                    }

                    return { ...currentTodo };
                  }))).catch(() => {
                  setError('update');

                  setTodos(todos.map(todo => ({
                    ...todo,
                    loading: false,
                  })));
                });
              }}
            />
          )}

          <form
            onSubmit={event => {
              event.preventDefault();

              if (!newTodoField) {
                changeError('empty');

                return;
              }

              if (!user) {
                changeError('add');

                return;
              }

              const newTodo = {
                id: -Infinity,
                userId: user.id,
                title: newTodoField,
                completed: false,
                loading: true,
              };

              setTodos(currentTodos => [
                ...currentTodos,
                newTodo,
              ]);

              postTodo(user.id, newTodoField).then(response => {
                setNewTodoField('');

                setTodos(currentTodos => currentTodos
                  .map(todo => {
                    const result = todo;

                    if (todo === newTodo) {
                      result.id = response.id;
                      result.loading = false;
                    }

                    return result;
                  }));
              }).catch(() => {
                setError('add');
                setTodos(todos.filter(todo => todo !== newTodo));
              });
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoField}
              onChange={event => setNewTodoField(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.filter(todo => filter === 'all' || todo.completed
          === (filter === 'completed')).map(todo => (
            <Todo
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              setError={setError}
              key={todo.id}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  {
                    selected: filter === 'all',
                  },
                )}
                onClick={event => {
                  event.preventDefault();

                  if (filter !== 'all') {
                    setFilter('all');
                  }
                }}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link',
                  {
                    selected: filter === 'active',
                  },
                )}
                onClick={event => {
                  event.preventDefault();

                  if (filter !== 'active') {
                    setFilter('active');
                  }
                }}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link',
                  {
                    selected: filter === 'completed',
                  },
                )}
                onClick={event => {
                  event.preventDefault();

                  if (filter !== 'completed') {
                    setFilter('completed');
                  }
                }}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={todos.filter(todo => todo.completed).length === 0}
              onClick={() => {
                setTodos(todos.map(currentTodo => {
                  if (currentTodo.completed) {
                    return {
                      ...currentTodo,
                      loading: true,
                    };
                  }

                  return { ...currentTodo };
                }));

                const promises: Promise<number>[] = [];

                todos.forEach(currentTodo => {
                  if (currentTodo.completed) {
                    promises
                      .push(deleteTodo(currentTodo.id) as Promise<number>);
                  }
                });

                Promise.all(promises).then(() => setTodos(todos
                  .filter(todo => !todo.completed))).catch(() => {
                  setError('delete');

                  setTodos(todos.map(todo => ({
                    ...todo,
                    loading: false,
                  })));
                });
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: error === '',
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error === 'empty' && 'Title can\'t be empty'}
        {error === 'add' && 'Unable to add a todo'}
        {error === 'delete' && 'Unable to delete a todo'}
        {error === 'update' && 'Unable to update a todo'}
      </div>
    </div>
  );
};
