/* eslint-disable jsx-a11y/control-has-associated-label */
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { prepareTodos } from './utils/prepareTodos';

const USER_ID = 6396;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isTitleDisabled, setIsTitleDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [isProcessedIds, setIsProcessedId] = useState<number[]>([]);

  const fetchAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Update);
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    prepareTodos(todos, filterType)
  ), [todos, filterType]);

  const handleError = useCallback((error: boolean) => {
    setHasError(error);
  }, []);

  const handleInput = useCallback((input: string) => {
    setTitle(input);
  }, []);

  const handleFilterType = useCallback((filter: FilterType) => {
    setFilterType(filter);
  }, []);

  const clearError = useCallback(() => {
    setHasError(false);
  }, []);

  const clearErrorAfterDelay = useCallback(
    debounce(clearError, 3000),
    [],
  );

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    const todoTitleTrim = todoTitle.trim();

    if (!todoTitleTrim.length) {
      setHasError(true);
      setErrorType(ErrorType.Title);
      clearErrorAfterDelay();

      return;
    }

    const todoToAdd = {
      id: 0,
      title: todoTitleTrim,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsTitleDisabled(true);

      const newTodo = await addTodo(USER_ID, todoToAdd);

      setIsProcessedId(currIds => [...currIds, newTodo.id]);
      setTempTodo(newTodo);

      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch (error) {
        setErrorType(ErrorType.Update);
      }
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Add);
      clearErrorAfterDelay();
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsTitleDisabled(false);
      setIsProcessedId([]);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsProcessedId(currIds => [...currIds, todoId]);
      await removeTodo(USER_ID, todoId);

      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Delete);
      clearErrorAfterDelay();
    } finally {
      setIsProcessedId([]);
    }
  }, []);

  const handleCompletedTodos = useCallback(async () => {
    try {
      todos.forEach(todo => {
        if (todo.completed) {
          handleDeleteTodo(todo.id);
        }
      });
    } catch (error) {
      setErrorType(ErrorType.Update);
      setHasError(true);
    }
  }, [todos]);

  const handleUpdateTodo = useCallback(
    async (todoId: number, value: boolean | string) => {
      try {
        setIsProcessedId(currIds => [...currIds, todoId]);

        let newData = {};

        if (typeof value === 'boolean') {
          newData = {
            completed: value,
          };
        }

        if (typeof value === 'string') {
          newData = {
            title: value,
          };
        }

        await updateTodo(USER_ID, todoId, newData);
        await fetchAllTodos();
      } catch (error) {
        setHasError(true);
        setErrorType(ErrorType.Update);
        clearErrorAfterDelay();
      } finally {
        setIsProcessedId([]);
      }
    }, [],
  );

  const handleAllTodosStatus = async () => {
    try {
      const areTodosCompleted = todos.every(todo => todo.completed);

      todos.forEach(todo => {
        handleUpdateTodo(todo.id, !areTodosCompleted);
      });
    } catch (error) {
      setErrorType(ErrorType.Update);
      setHasError(true);
    } finally {
      setIsProcessedId([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          title={title}
          todos={todos}
          handleInput={handleInput}
          handleAddTodo={handleAddTodo}
          isTitleDisabled={isTitleDisabled}
          handleAllTodosStatus={handleAllTodosStatus}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
              handleUpdateTodo={handleUpdateTodo}
              isProcessedIds={isProcessedIds}
            />
            <Footer
              todos={todos}
              filterType={filterType}
              handleFilterType={handleFilterType}
              handleCompletedTodos={handleCompletedTodos}
            />
          </>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <Notification
          errorType={errorType}
          hasError={hasError}
          handleError={handleError}
        />
      )}
    </div>
  );
};
