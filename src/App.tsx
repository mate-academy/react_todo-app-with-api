/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { getVisibleTodos } from './utils/helpers';

const USER_ID = 10930;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.ALL);
  const [error, setError] = useState<string | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Unexpected error fetching todos');
      });
  }, []);

  useEffect(() => {
    let timeout: number;

    if (error) {
      timeout = window.setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(filter, todos, completedTodos, activeTodos);
  }, [todos, filter]);

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodos([0]);
    }
  }, []);

  const handleToggleTodoStatus = useCallback(async (todoToUpdate: Todo) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoToUpdate.id]);

      const newTodoStatus = !todoToUpdate.completed;
      const updatedTodo = await updateTodoStatus(
        todoToUpdate.id,
        newTodoStatus,
      ) as Todo;

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id !== todoToUpdate.id
            ? todo
            : updatedTodo
        ))
      ));
    } catch {
      setError('Unable to update todo');
    } finally {
      setLoadingTodos(currentTodosId => currentTodosId
        .filter(todoId => todoId !== todoToUpdate.id));
    }
  }, []);

  const handleUpdateTodoTitle = useCallback(async (
    todoToUpdate: Todo,
    title: string,
  ) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoToUpdate.id]);

      const hasTitle = title
        ? { title }
        : { completed: !todoToUpdate.completed };

      const updatedTodo = {
        ...todoToUpdate,
        ...hasTitle,
      } as Todo;

      await updateTodoTitle(updatedTodo);

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id !== todoToUpdate.id
            ? todo
            : updatedTodo
        ))
      ));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(currentTodosId => currentTodosId
        .filter(todoId => todoId !== todoToUpdate.id));
    }
  }, []);

  const handleToggleAllTodos = useCallback(() => {
    let toggledTodos = todos;

    if (activeTodos.length) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(todo => handleToggleTodoStatus(todo));
  }, [todos]);

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(async (todo) => {
      await handleRemoveTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          handleAddTodo={handleAddTodo}
          handleToggleAllTodos={handleToggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          handleRemoveTodo={handleRemoveTodo}
          handleToggleTodoStatus={handleToggleTodoStatus}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />

        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            filter={filter}
            onFilterChange={setFilter}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
