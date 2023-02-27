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
import { Loader } from './components/Loader';
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
  const [isProcessedIds, setIsProcessedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTodos = async () => {
    try {
      setIsLoading(true);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Update);
    } finally {
      setIsLoading(false);
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
      title: todoTitleTrim,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsTitleDisabled(true);

      const newTodo = await addTodo(USER_ID, todoToAdd);

      setIsProcessedIds(currIds => [...currIds, newTodo.id]);
      setTempTodo(newTodo);

      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Add);
      clearErrorAfterDelay();
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsTitleDisabled(false);
      setIsProcessedIds([]);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsProcessedIds(currIds => [...currIds, todoId]);
      await removeTodo(USER_ID, todoId);

      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Delete);
      clearErrorAfterDelay();
    } finally {
      setIsProcessedIds([]);
    }
  }, []);

  const handleCompletedTodos = useCallback(async () => {
    try {
      await Promise.all(todos.map(async todo => {
        if (todo.completed) {
          await handleDeleteTodo(todo.id);
        }
      }));
    } catch (error) {
      setErrorType(ErrorType.Update);
      setHasError(true);
    }
  }, [todos]);

  const handleUpdateTodo = async (todoId: number, value: boolean | string) => {
    try {
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

      setIsProcessedIds(currIds => [...currIds, todoId]);

      await updateTodo(USER_ID, todoId, newData);
      await fetchAllTodos();
      setIsProcessedIds([]);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Update);
      clearErrorAfterDelay();
    }
  };

  const handleAllTodosStatus = async () => {
    try {
      const areTodosCompleted = todos.every(todo => todo.completed);

      todos.forEach(todo => {
        if (todo.completed !== !areTodosCompleted) {
          handleUpdateTodo(todo.id, !areTodosCompleted);
        }
      });
    } catch (error) {
      setErrorType(ErrorType.Update);
      setHasError(true);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        {isLoading
          ? (<Loader />)
          : (
            <Header
              title={title}
              todos={todos}
              handleInput={handleInput}
              handleAddTodo={handleAddTodo}
              isTitleDisabled={isTitleDisabled}
              handleAllTodosStatus={handleAllTodosStatus}
            />
          )}

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
