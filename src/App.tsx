/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import {
  getTodos,
  deleteTodo,
  postTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Header } from './components/Header/Header';
import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { USER_ID } from './types';
import { TodosError } from './types/Errors';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filterTodos } from './helpers';
import { SortTodoBy } from './types/SortTodoBy';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [sortTodosBy, setSortTodosBy] = useState(SortTodoBy.Default);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [disableField, setDisableField] = useState(false);

  const visiableTodos = filterTodos(todos, sortTodosBy);
  const completedTodos = useCallback(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const activeTodos = todos.filter(todo => !todo.completed);
  const hasActiveTodos = activeTodos.length !== 0;
  const hasCompletedTodos = completedTodos().length !== 0;

  const handleShowError = (text: string) => {
    setLoadingError(true);
    setErrorText(text);

    setTimeout(() => {
      setLoadingError(false);
    }, 3000);
  };

  const handleCloseError = () => {
    setLoadingError(false);
  };

  const loadTodos = (userId: number) => {
    setIsLoading(true);
    setLoadingError(false);

    getTodos(userId)
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        handleShowError(TodosError.FailedLoadingGoods);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTodos(USER_ID);
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      handleShowError(TodosError.InvalidTitle);
    } else {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      try {
        setDisableField(true);
        setTempTodo({
          ...newTodo,
          id: 0,
        });

        await postTodo(newTodo)
          .then((response) => setTodos([...todos, response]));
      } catch {
        handleShowError(TodosError.AddTodo);
      } finally {
        setDisableField(false);
        setTempTodo(null);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodosIds(prevTodos => [...prevTodos, todoId]);

      await deleteTodo(todoId);

      setTodos(() => todos.filter(todo => todo.id !== todoId));
    } catch {
      handleShowError(TodosError.DeleteTodo);
    } finally {
      setLoadingTodosIds([]);
    }
  };

  const handleRemoveCompletedTodo = useCallback(() => {
    completedTodos().forEach(({ id }) => {
      setLoadingTodosIds((prevCompleted) => [
        ...prevCompleted,
        id,
      ]);

      handleDeleteTodo(id)
        .then(() => {
          setTodos(
            (prevTodos) => prevTodos.filter(todo => !todo.completed),
          );
        })
        .finally(() => setLoadingTodosIds([]));
    });
  }, [todos]);

  const handleUpdateTodo = async (todoId: number, property: Partial<Todo>) => {
    try {
      setLoadingTodosIds(prevTodos => [...prevTodos, todoId]);

      const updatedTodo = await updateTodo(todoId, property);

      setTodos((prevTodos) => prevTodos
        .map((prevTodo) => {
          return prevTodo.id === todoId
            ? {
              ...prevTodo,
              ...updatedTodo,
            } : prevTodo;
        }));
    } catch {
      handleShowError(TodosError.UpdateTodo);
    } finally {
      setLoadingTodosIds([]);
    }
  };

  const handleUpdateAllTodod = async () => {
    activeTodos.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: true });
    });

    if (!activeTodos.length) {
      completedTodos().forEach(todo => {
        handleUpdateTodo(todo.id, { completed: false });
      });
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
          hasActiveTodos={hasActiveTodos}
          onAddTodo={handleAddTodo}
          disable={disableField}
          onUpdateAll={handleUpdateAllTodod}
        />

        {isLoading && (
          <Loader />
        )}

        <TodoList
          tempTodo={tempTodo}
          todos={visiableTodos}
          onDeleteTodo={handleDeleteTodo}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <TodoFilter
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodos.length}
            sortBy={sortTodosBy}
            changeSortBy={setSortTodosBy}
            onCompletedDelete={handleRemoveCompletedTodo}
          />
        )}
      </div>

      {loadingError && (
        <ErrorMessage
          text={errorText}
          onClose={handleCloseError}
          showError={loadingError}
        />
      )}
    </div>
  );
};
