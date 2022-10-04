import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [selectedId, setSelectedId] = useState(0);
  const [toggleAll, setToggleAll] = useState(true);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filterTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.All:
        return todo;
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return 0;
    }
  });

  const userId = 0;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const loadTodos = async (userID: number) => {
      try {
        setTodos(await getTodos(userID));
      } catch {
        setError(Errors.Loading);
      }
    };

    loadTodos(user?.id || userId);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
      setError(Errors.Title);
      setTitle('');
      setIsLoading(false);

      return;
    }

    await createTodo(userId, title)
      .then(newTodo => {
        setTodos([newTodo, ...todos]);
        setSelectedId(newTodo.id);
      })
      .catch(() => {
        setError(Errors.Add);
      })
      .finally(() => {
        setTitle('');
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  const removeTodo = async (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(Errors.Delete);
      })
      .finally(() => setIsLoading(false));
  };

  const improveTodo = async (todoId: number, data: Partial<Todo>) => {
    setIsLoading(true);
    setSelectedId(todoId);

    await updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(prev => prev
          .map(todo => (todo.id === todoId
            ? updatedTodo
            : todo)));
      })
      .catch(() => {
        setError(Errors.Updating);
      })
      .finally(() => {
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  const handlerToggler = () => {
    setToggleAll(!toggleAll);
    setToggleLoader(true);

    return filterTodos
      .forEach(todo => improveTodo(todo.id, { completed: toggleAll }));
  };

  const todosCompleted = useMemo(() => todos
    .filter(({ completed }) => completed), [todos]);
  const todosActive = useMemo(() => todos
    .filter(({ completed }) => !completed), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!filterTodos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              aria-label="label"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: filterTodos.length === todosCompleted.length,
                },
              )}
              onClick={() => handlerToggler()}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={filterTodos}
          removeTodo={removeTodo}
          improveTodo={improveTodo}
          isLoading={isLoading}
          selectedId={selectedId}
          toggleLoader={toggleLoader}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            removeTodo={removeTodo}
            todosActive={todosActive}
            todosCompleted={todosCompleted}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
