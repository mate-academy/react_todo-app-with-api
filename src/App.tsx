/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { SortType } from './types/SortType';
import { prepareTodos } from './utils/prepareTodos';
import { ErrorType } from './types/ErrorType';

const USER_ID = 6358;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const hasTodos = todos.length !== 0;
  const activeTodosAmount = useMemo(
    () => todos.filter(todo => !todo.completed).length, [todos],
  );

  const isCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const isAllCompleted = (
    todos.length === completedTodos.length && todos.length > 0);

  const autoCloseNotification = useCallback(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, []);

  const addErrorMessage = (errorMessage: ErrorType) => {
    setErrorType(errorMessage);
    autoCloseNotification();
  };

  const fetchedTodos = async () => {
    try {
      setErrorType(ErrorType.NONE);
      const data = await getTodos(USER_ID);

      setTodos(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      addErrorMessage(ErrorType.GET);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchedTodos();
  }, []);

  const handleSortTodos = useCallback((sort: SortType) => {
    setSortType(sort);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setErrorType(ErrorType.NONE);
  }, []);

  const visibleTodos = useMemo(() => (
    prepareTodos(todos, sortType)
  ), [todos, sortType]);

  const handleAddTodo = useCallback(async (
    title: string, userId: number,
  ) => {
    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    try {
      setIsLoading(true);
      setTempTodo(newTempTodo);

      await addTodo(title, userId);
      await fetchedTodos();
    } catch (error) {
      addErrorMessage(ErrorType.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingTodos(prevId => ([...prevId, todoId]));
      await deleteTodo(todoId);
      await fetchedTodos();
    } catch (error) {
      addErrorMessage(ErrorType.DELETE);
    } finally {
      setProcessingTodos([]);
    }
  }, []);

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleUpdateTodo = useCallback(async (
    todoId: number,
    title: string,
    completed: boolean,
  ) => {
    try {
      setProcessingTodos(prevId => ([...prevId, todoId]));
      await updateTodo(todoId, title, completed);
      await fetchedTodos();
    } catch (error) {
      addErrorMessage(ErrorType.UPDATE);
    } finally {
      setProcessingTodos([]);
    }
  }, []);

  const handleToggleAllTodos = () => {
    if (isAllCompleted) {
      completedTodos.forEach(todo => {
        const { id, title, completed } = todo;

        handleUpdateTodo(id, title, !completed);
      });

      return;
    }

    todos.forEach(todo => {
      const { id, title } = todo;

      handleUpdateTodo(id, title, true);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          userId={USER_ID}
          onAddTodo={handleAddTodo}
          onAddErrorMessage={addErrorMessage}
          isLoading={isLoading}
          isAllCompleted={isAllCompleted}
          onToggleAllTodos={handleToggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          processingTodos={processingTodos}
          onUpdateTodo={handleUpdateTodo}
        />

        {hasTodos && (
          <Footer
            activeTodosAmount={activeTodosAmount}
            onSort={handleSortTodos}
            sortType={sortType}
            onClearCompletedTodos={handleClearCompleted}
            isCompletedTodo={isCompletedTodos}
          />
        )}
      </div>

      <Notification
        errorType={errorType}
        onCloseNotification={handleCloseNotification}
      />
    </div>
  );
};
