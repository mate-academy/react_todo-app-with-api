/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, UpdateTodoArgs } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { Error } from './components/Error';
import { Filters } from './types/Filters';
import { TodoList } from './components/TodoList';
import { Header } from './Header';
import { Footer } from './Footer';

const USER_ID = 10892;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filters.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isActiveTodos = uncompletedTodos.length === 0;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.COMPLETED:
        return completedTodos;

      case Filters.ACTIVE:
        return uncompletedTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const handleCloseError = () => {
    setError(null);
  };

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  };

  const handleClearCompletedTodo = async () => {
    try {
      await Promise.all(completedTodos.map(
        todo => removeTodo(todo.id),
      ));
    } catch {
      setError('Unable to clear completed todos');
    }
  };

  const updateTodo = useCallback(async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setLoadingTodo(prevLoadingTodo => [...prevLoadingTodo, todoId]);
      const updatedTodo = await patchTodo(todoId, args);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodo((prevLoadingTodo) => (
        prevLoadingTodo.filter((id) => id !== todoId)));
    }
  }, []);

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);

    try {
      setLoadingTodo(prevLoadingTodo => (
        [...prevLoadingTodo, ...updatedTodos.map(todo => todo.id)]));
      await Promise.all(updatedTodos.map(todo => (
        updateTodo(todo.id, { completed: !allCompleted }))));
    } catch {
      setError('Unable to update todos');
    } finally {
      setLoadingTodo([]);
    }
  };

  const handleShowError = (erorMessage: string) => {
    setError(erorMessage);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleShowError={handleShowError}
          handleToggleAll={handleToggleAll}
          isActiveTodos={isActiveTodos}
          OnAddTodo={addTodo}
        />

        <TodoList
          todos={filteredTodos}
          onRemoveTodo={removeTodo}
          tempTodo={tempTodo}
          loadingTodo={loadingTodo}
          onUpdateTodo={updateTodo}
          handleShowError={handleShowError}
        />

        {todos.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            completedTodos={completedTodos}
            todoFilter={filter}
            onChangeFilter={setFilter}
            onClearCompletedTodos={handleClearCompletedTodo}
          />
        )}
      </div>

      <Error error={error} onCloseError={handleCloseError} />
    </div>
  );
};
