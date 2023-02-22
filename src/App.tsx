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

  const handleError = (error: boolean) => {
    setHasError(error);
  };

  const handleInput = (input: string) => {
    setTitle(input);
  };

  const handleFilterType = (filter: FilterType) => {
    setFilterType(filter);
  };

  const clearError = useCallback(() => {
    setHasError(false);
  }, []);

  const clearErrorAfterDelay = useCallback(
    debounce(clearError, 3000),
    [],
  );

  const handleAddTodo = async (todoTitle: string) => {
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

      setTempTodo(newTodo);

      setTodos(currTodos => ([
        ...currTodos, newTodo,
      ]));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Add);
      clearErrorAfterDelay();
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsTitleDisabled(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await removeTodo(USER_ID, todoId);

      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Delete);
      clearErrorAfterDelay();
    }
  };

  const handleCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleUpdateTodo = async (todoId: number, value: boolean) => {
    try {
      const newData = {
        completed: value,
      };

      await updateTodo(USER_ID, todoId, newData);
      await fetchAllTodos();
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Update);
      clearErrorAfterDelay();
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
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
              handleUpdateTodo={handleUpdateTodo}
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
