/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import './styles/App.scss';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [todosState, setTodosState] = useState('all');
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isAllToggled, setIsAllToggled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const errorSwitcher = (errorText: string) => {
    setError(errorText);

    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    if (user) {
      setUserId(user.id);

      getTodos(user.id)
        .then(res => {
          setTodos(res);
        })
        .finally(() => {
          setShouldUpdate(false);
        });
    }
  }, [user, shouldUpdate, isAllToggled]);

  const addNewTodo = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      errorSwitcher('Title can\'t be empty');

      return;
    }

    setIsLoading(true);

    if (user) {
      addTodo(todoTitle, userId, false)
        .then(res => setTodos(prev => [...prev, res]))
        .catch(() => errorSwitcher('Unable to add a todo'))
        .finally(() => {
          setTodoTitle('');
          setIsAllToggled(false);
          setIsLoading(false);
        });
    }
  }, [todoTitle, user]);

  const updateTodoById = useCallback((todoId: number, data: {}) => {
    setSelectedTodoId(todoId);
    setIsUpdateLoading(true);
    updateTodo(todoId, data)
      .then(() => {
        setShouldUpdate(true);
      })
      .catch(() => errorSwitcher('Unable to update a todo'))
      .finally(() => {
        setIsUpdateLoading(false);
        setIsAllToggled(false);
      });
  }, []);

  const toggleAllCompleted = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed === true);

    setIsAllToggled(true);
    todos.forEach((todo) => updateTodoById(
      todo.id, { completed: !areAllCompleted },
    ));
  }, [todos]);

  const removeTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    setIsRemoveLoading(true);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setShouldUpdate(true);
        }
      })
      .catch(() => errorSwitcher('Unable to delete a todo'))
      .finally(() => setIsRemoveLoading(false));
  }, []);

  const visibleTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => {
      if (todosState === 'completed') {
        return todo.completed === true;
      }

      if (todosState === 'active') {
        return todo.completed === false;
      }

      return todo;
    });
  }, [todosState, todos]);

  const clearCompletedTodos = useCallback(
    () => {
      const todosToDelete = todos.filter(todo => todo.completed);

      todosToDelete.map(todo => deleteTodo(todo.id));

      setShouldUpdate(true);
    }, [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {visibleTodos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              onClick={() => toggleAllCompleted()}
            />
          )}

          <form onSubmit={addNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          selectedTodoId={selectedTodoId}
          isLoading={isLoading}
          title={todoTitle}
          isRemoveLoading={isRemoveLoading}
          updateTodoById={updateTodoById}
          isUpdateLoading={isUpdateLoading}
          isAllToggled={isAllToggled}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={`filter__link ${todosState === 'all' ? 'selected' : ''}`}
                onClick={() => setTodosState('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={`filter__link ${todosState === 'active' ? 'selected' : ''}`}
                onClick={() => setTodosState('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={`filter__link ${todosState === 'completed' ? 'selected' : ''}`}
                onClick={() => setTodosState('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={() => clearCompletedTodos()}
              style={todos.some(todo => todo.completed)
                ? { opacity: 1 }
                : { opacity: 0 }}
            >
              Clear completed
            </button>
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
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}
    </div>
  );
};
