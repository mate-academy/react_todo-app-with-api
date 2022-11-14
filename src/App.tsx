/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import {
  getTodos,
  createTodo,
  deleteTodos,
  updateTodo,
} from './api/todos';

import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const filteredTodo = useMemo(() => todos.filter(todo => {
    switch (sortType) {
      case SortType.ALL:
        return todo;
      case SortType.ACTIVE:
        return !todo.completed;
      case SortType.COMPLETED:
        return todo.completed;
      default:
        return null;
    }
  }), [todos, sortType]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (!user) {
      return;
    }

    const getTodosFromServer = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch (errorMessage) {
        setError(`${errorMessage}`);
      }
    };

    getTodosFromServer(user.id);
  }, []);

  const getValue = useCallback(
    (element: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(element.target.value);
    }, [title],
  );

  const addNewTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !user) {
      setError(ErrorType.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      setError(ErrorType.NotAdd);
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedIds([TodoId]);

    try {
      await deleteTodos(TodoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setError(ErrorType.NotDelete);
    }
  }, [todos, error]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const clearCompletedTodos = useCallback(
    async () => {
      try {
        setSelectedIds([...completedTodos].map(({ id }) => id));

        await Promise.all(completedTodos.map(({ id }) => removeTodo(id)));
        await (() => setTodos((prevTodos) => prevTodos
          .filter(({ completed }) => !completed)));
      } catch {
        setError(ErrorType.NotDelete);
        setSelectedIds([]);
      }
    }, [todos, selectedIds, error],
  );

  const handleChange = async (todoId: number, data: Partial<Todo>) => {
    setSelectedIds([todoId]);

    try {
      const value = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? value
          : todo
      )));
    } catch {
      setError(ErrorType.NotUpdate);
    }

    setSelectedIds([]);
  };

  const handleAllCompleted = useCallback(() => {
    const isAllCompleted = todos.every(({ completed }) => completed);

    Promise.all(todos.map(({ id }) => handleChange(id, {
      completed: !isAllCompleted,
    })))
      .then(() => setTodos(todos.map(todo => ({
        ...todo,
        completed: !isAllCompleted,
      }))))
      .catch(() => {
        setError(ErrorType.NotUpdate);
        setSelectedIds([]);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoForm
          handleAllCompleted={handleAllCompleted}
          addNewTodo={addNewTodo}
          newTodoField={newTodoField}
          title={title}
          getValue={getValue}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              filteredTodo={filteredTodo}
              removeTodo={removeTodo}
              selectedIds={selectedIds}
              isAdding={isAdding}
              title={title}
              handleChange={handleChange}
            />

            <Footer
              todos={todos}
              sortType={sortType}
              setSortType={setSortType}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorMessage
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
