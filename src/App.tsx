/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

const USER_ID = 10999;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [errorMessage]);

  const hasActiveTodo = !!todos?.some((todo) => !todo.completed);
  const completedTodos = todos?.filter((todo) => todo.completed);
  const uncompletedTodos = todos?.filter((todo) => !todo.completed);
  const areAllTodosCompleted = useCallback(() => todos.every((todo) => todo.completed), []);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return uncompletedTodos;

      case FilterStatus.COMPLETED:
        return completedTodos;

      case FilterStatus.ALL:
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    setIsLoading(true);

    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);

    try {
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: true } : todo)));

      await removeTodo(todoId);

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearAllCompletedTodos = useCallback(async () => {
    todos
      .filter((todo) => todo.completed)
      .map((todo) => handleRemoveTodo(todo.id));
  }, [todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage("Title can't be empty");
    }

    handleAddTodo(todoTitle);
    setTodoTitle('');
  };

  const handleToggleCompleted = useCallback(
    async (todoId: number, completed: boolean) => {
      setIsLoading(true);

      try {
        const updatedTodo = {
          completed: !completed,
        };

        setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId
          ? { ...todo, completed: !completed, isLoading: true }
          : todo
        )));

        await updateTodo(todoId, updatedTodo);

        setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: false } : todo)));
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleToggleAllTodosCompleted = () => {
    setIsLoading(true);

    try {
      todos.map((todo) => handleToggleCompleted(todo.id, todo.completed));
    } catch {
      setErrorMessage('Unable to toggle all todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTitle = async (todoId: number, newTitle: string) => {
    try {
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: true } : todo)));
      await updateTodo(todoId, { title: newTitle });

      setTodos(currentTodos => currentTodos.map(todo => (todo.id === todoId ? { ...todo, title: newTitle, isLoading: false } : todo)));
    } catch {
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodo={hasActiveTodo}
          areAllTodosCompleted={areAllTodosCompleted}
          handleToggleAllTodosCompleted={handleToggleAllTodosCompleted}
          handleSubmit={handleSubmit}
          todoTitle={todoTitle}
          tempTodo={tempTodo}
          setTodoTitle={setTodoTitle}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleToggleCompleted={handleToggleCompleted}
          handleRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          handleChangeTitle={handleChangeTitle}
        />

        {todos?.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodos}
            handleClearAllCompletedTodos={handleClearAllCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
