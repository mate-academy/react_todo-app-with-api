import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './helpers';
import { StatusFilter } from './types/StatusFilter';
import { Todo } from './types/Todo';
import { USER_ID } from './consts/consts';
import './styles/todoapp.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setFilterStatus] = useState(StatusFilter.ALL);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(errorFromServer => {
        setError(`Unable to load todos: ${errorFromServer.message}`);
      });
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const todosCount = todos.length;
  const areTodosVisible = todosCount > 0;

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, statusFilter)
  ), [todos, statusFilter]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos, statusFilter]);

  const activeTodos = useMemo(() => (
    todos.filter((todo) => !todo.completed)
  ), [todos, statusFilter]);

  const hasSomeCompletedTodos = completedTodos.length > 0;
  const hasOnlyCompletedTodos = completedTodos.length === todosCount;

  const changeFilterStatus = useCallback((filterStaus: StatusFilter) => {
    setFilterStatus(filterStaus);
  }, []);

  const closeNotifications = useCallback(() => setError(null), []);

  const changeNotification = (errorMessage: string) => {
    setError(errorMessage);
  };

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const addTodo = useCallback((todoTitle: string) => {
    setIsLoading(true);

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    postTodo(newTodo)
      .then((todoFromResponse) => {
        setTodos([
          ...todos,
          todoFromResponse,
        ]);
      })
      .catch((errorFromServer) => {
        setError(`Unable to add a todo: ${errorFromServer.message}`);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setTitle('');
      });
  }, [todos]);

  const removeTodo = useCallback((todoId: number) => {
    setLoadingTodoIds((currentTodoIds) => [
      ...currentTodoIds,
      todoId,
    ]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => (
          currentTodos.filter((todo) => todo.id !== todoId)
        ));
      })
      .catch((errorFromServer) => {
        setError(`Unable to delete a todo: ${errorFromServer.message}`);
      })
      .finally(() => {
        setLoadingTodoIds((currentIds) => (
          currentIds.filter((id) => id !== todoId)
        ));
      });
  }, [todos]);

  const clearCompletedTodos = useCallback(() => {
    completedTodos.forEach(async (todo) => {
      removeTodo(todo.id);
    });
  }, [completedTodos]);

  const updateTodo = useCallback((
    todoId: number,
    updatedValue: string | boolean,
  ) => {
    setLoadingTodoIds((currentTodoIds) => [
      ...currentTodoIds,
      todoId,
    ]);

    const updatedField = typeof updatedValue === 'boolean'
      ? 'completed'
      : 'title';

    const updatedTodo: Partial<Todo> = {
      [updatedField]: updatedValue,
    };

    patchTodo(todoId, updatedTodo)
      .then((todoFromServer) => {
        const updatedTodos = todos.map((todo) => (
          todo.id === todoFromServer.id ? todoFromServer : todo
        ));

        setTodos(updatedTodos);
      })
      .catch((errorFromServer) => {
        setError(`Unable to update a todo: ${errorFromServer.message}`);
      })
      .finally(() => {
        setLoadingTodoIds((currentIds) => (
          currentIds.filter((id) => id !== todoId)
        ));
      });
  }, [todos]);

  const toggleAllTodos = useCallback(() => {
    todos.forEach(async (todo) => {
      updateTodo(todo.id, !todo.completed);
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isLoading={isLoading}
          hasOnlyCompletedTodos={hasOnlyCompletedTodos}
          onAddTodo={addTodo}
          onChangeTitle={changeTitle}
          onToggleAllTodos={toggleAllTodos}
          onChangeNotification={changeNotification}
        />

        {areTodosVisible && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={visibleTodos}
              onRemoveTodo={removeTodo}
              onUpdateTodo={updateTodo}
              loadingTodoIds={loadingTodoIds}
            />

            <Footer
              hasSomeCompletedTodos={hasSomeCompletedTodos}
              count={activeTodos.length}
              statusFilter={statusFilter}
              onFilter={changeFilterStatus}
              onClearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <Notification
          error={error}
          onCloseNotifications={closeNotifications}
        />
      )}
    </div>
  );
};
