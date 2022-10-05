/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef, useState,
  FormEvent,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setError] = useState<Error | null>(null);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [toggleAll, setToggleAll] = useState(true);
  const [selectedId, setSelectedId] = useState(0);

  const userId = user?.id || 1;

  getTodos(userId)
    .then(setTodos)
    .catch(() => setError(Error.Loading));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    setIsAdding(true);

    await createTodo(userId, title)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setError(Error.Add);
      });

    setTitle('');
    setIsAdding(true);
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos((initialTodos) => initialTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setError(Error.Delete);
      });
  };

  const handleUpdateTodo = async (todoId: number, data: Partial<Todo>) => {
    setIsAdding(true);
    setSelectedId(todoId);

    await updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(initialTodos => initialTodos
          .map(todo => (todo.id === todoId
            ? updatedTodo
            : todo)));
      })
      .catch(() => {
        setError(Error.Updating);
      })
      .finally(() => {
        setIsAdding(false);
        setToggleLoader(false);
      });
  };

  const visibleTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.All:
        return todo;

      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return 0;
    }
  });

  const handleToggler = () => {
    setToggleAll(!toggleAll);
    setToggleLoader(true);

    return visibleTodos
      .forEach((todo) => handleUpdateTodo(todo.id, { completed: toggleAll }));
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={() => handleToggler}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>
        {(isAdding || todos.length > 0) && (
          <TodoList
            todos={visibleTodos}
            removeTodo={removeTodo}
            isAdding={isAdding}
            handleUpdateTodo={handleUpdateTodo}
            toggleLoader={toggleLoader}
            selectedId={selectedId}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            changeFilter={setFilter}
            todos={todos}
            removeTodo={removeTodo}
          />
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          handleError={setError}
          setErrorMessage={setError}
        />
      )}
    </div>
  );
};
