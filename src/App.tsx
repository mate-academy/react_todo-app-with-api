/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef, useState,
  FormEvent,
  useMemo,
  useCallback,
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
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setError] = useState<Error | null>(null);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [completedIds, setCompletedIds] = useState<number[] | null>(null);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const userId = user?.id || 1;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const getTodosFromServer = async (Id: number) => {
      try {
        setTodos(await getTodos(Id));
      } catch {
        setError(Error.Loading);
      }
    };

    getTodosFromServer(userId);
  }, []);

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos],
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!title.trim()) {
        setError(Error.Title);
        setTitle('');

        return;
      }

      const newTodo = {
        id: Math.max(0, ...todos.map(({ id }) => id)) + 1,
        userId: user?.id || 0,
        completed: false,
        title,
      };

      setTodos((prevState) => [newTodo, ...prevState]);
      setSelectedId(newTodo.id);
      setIsAdding(true);
      setTitle('');

      try {
        await createTodo(newTodo);
      } catch {
        setError(Error.Add);
      } finally {
        setIsFocused((prevState) => !prevState);
        setSelectedId(0);
        setIsAdding(false);
      }
    },
    [title],
  );

  const removeTodo = async (todoId: number) => {
    setSelectedId(todoId);
    setIsAdding(true);

    await deleteTodo(todoId)
      .then(() => {
        setTodos((initialTodos) => initialTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setError(Error.Delete);
      })
      .finally(() => {
        setToggleLoader(false);
        setIsAdding(false);
      });
  };

  const handleUpdateTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      setIsAdding(true);
      setSelectedId(todoId);

      try {
        const newTodo = await updateTodo(todoId, data);

        setTodos((prevState) => prevState
          .map((todo) => (todo.id === todoId ? newTodo : todo)));
      } catch {
        setError(Error.Updating);
      } finally {
        setIsAdding(false);
        setSelectedId(0);
      }
    },
    [],
  );

  const visibleTodos = useMemo(() => todos.filter((todo) => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  }), [todos, filter]);

  const handleToggler = useCallback(async () => {
    setIsAdding(true);
    setToggleLoader(true);

    try {
      let newTodos;

      if (activeTodos.length) {
        newTodos = await Promise.all(
          todos.map((todo) => updateTodo(todo.id, { completed: true })),
        );
      } else {
        newTodos = await Promise.all(
          todos.map((todo) => updateTodo(todo.id, { completed: false })),
        );
      }

      setTodos(newTodos);
    } catch {
      setError(Error.Updating);
    } finally {
      setIsAdding(false);
      setToggleLoader(false);
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    setIsAdding(true);
    setCompletedIds(completedTodos.map((todo) => todo.id));

    try {
      await Promise.all(completedTodos.map((todo) => deleteTodo(todo.id)));
      setTodos(activeTodos);
    } finally {
      setIsAdding(false);
      setCompletedIds(null);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          createTodo={handleSubmit}
          toggleAll={handleToggler}
          title={title}
          setTitle={setTitle}
          isAdding={isAdding}
          toggleLoader={toggleLoader}
          isFocused={isFocused}
        />
        {(isAdding || todos.length > 0) && (
          <TodoList
            todos={visibleTodos}
            removeTodo={removeTodo}
            isAdding={isAdding}
            handleUpdateTodo={handleUpdateTodo}
            toggleLoader={toggleLoader}
            selectedId={selectedId}
            title={title}
            completedIds={completedIds}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            changeFilter={setFilter}
            todos={todos}
            removeTodo={removeTodo}
            setToggleLoader={setToggleLoader}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            clearCompleted={clearCompleted}
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
