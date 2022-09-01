/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/header';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  const [filterBy, setfilterBy] = useState('');
  const [unableAddTodo, setUnableAddTodo] = useState(false);
  const [unableDeleteTodo, setUnableDeleteTodo] = useState(false);
  const [unableUpdateTodo, setUnableUpdateTodo] = useState(false);
  const [unableEmptyTitle, setUnableEmptyTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      client.get<Todo[]>(`/todos?userId=${user.id}`)
        .then(setTodos);
    }
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    todos.map(todo => (todo.completed ? client.delete(`/todos/${todo.id}`) : todo));
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          setUnableAddTodo={setUnableAddTodo}
          setUnableEmptyTitle={setUnableEmptyTitle}
        />

        <TodosList
          todos={todos}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setTodos={setTodos}
          setUnableUpdateTodo={setUnableUpdateTodo}
          setunableDeleteTodo={setUnableDeleteTodo}
          filterBy={filterBy}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => todo.completed !== true).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'all' },
                )}
                onClick={() => setfilterBy('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'active' },
                )}
                onClick={() => setfilterBy('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'completed' },
                )}
                onClick={() => setfilterBy('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                { hidden: !todos.some(todo => todo.completed) },
              )}
              onClick={() => deleteCompletedTodos()}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {
        (unableAddTodo
          || unableDeleteTodo
          || unableUpdateTodo
          || unableEmptyTitle) && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => {
                setUnableAddTodo(false);
                setUnableEmptyTitle(false);
                setUnableDeleteTodo(false);
                setUnableUpdateTodo(false);
                setIsLoading(false);
              }}
            />
            {(unableAddTodo || unableEmptyTitle) && 'Unable to add a todo'}
            {unableDeleteTodo && 'Unable to delete a todo'}
            {unableUpdateTodo && 'Unable to update a todo'}
          </div>
        )
      }
    </div>
  );
};
