/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoItem } from './components/Todo/TodoItem';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [error, setError] = useState('');
  const [hidden, setHidden] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [sortBy, setSortBy] = useState('');

  const filteredTodos = todos.filter(todo => {
    switch (sortBy) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return todos;
    }
  });

  const switchError = (newError: string) => {
    setError(newError);
    setTimeout(() => setError(''), 3000);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      switchError('Title cant be empty');

      return;
    }

    if (!user) {
      return;
    }

    createTodo(user.id, todoTitle)
      .then(res => setTodos(prev => [
        ...prev,
        res,
      ]))
      .catch(() => switchError('Unable to add a todo'));

    setTodoTitle('');
  };

  const closeNotification = () => {
    setHidden(prev => !prev);
    setError('');
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(setTodos);
  }, [user, shouldUpdate]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => {
                setTodoTitle(e.target.value);
                setError('');
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              todos={todos}
              setTodos={setTodos}
              setShouldUpdate={setShouldUpdate}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames('filter__link', {
                  selected: sortBy === 'all',
                })}
                onClick={() => setSortBy('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames('filter__link', {
                  selected: sortBy === 'active',
                })}
                onClick={() => setSortBy('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames('filter__link', {
                  selected: sortBy === 'completed',
                })}
                onClick={() => setSortBy('completed')}
              >
                Completed
              </a>
            </nav>

            {/* <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
            >
              Clear completed
            </button> */}
          </footer>
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={closeNotification}
            hidden={hidden}
          />
          {error}
        </div>
      )}
    </div>
  );
};
