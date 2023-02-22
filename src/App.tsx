/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AddTodoForm } from './components/AddTodoForm';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterTypes } from './types/FIlterTypes';
import { Todo, UpdateData } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getFilteredTodos } from './utils/getFilteredTodos';

const USER_ID = 6359;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);

  const fetchUserTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessage.FIND);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    fetchUserTodos();
  }, []);

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    if (!todoTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      setHasError(true);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      setInputDisabled(true);

      await addTodo(USER_ID, newTodo);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  }, []);

  const handleDelete = useCallback(async (todo: Todo) => {
    setProcessedTodos((currentTodos) => [...currentTodos, todo]);

    try {
      await deleteTodo(todo.id);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessedTodos([]);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleFilterType = useCallback((filter: FilterTypes) => {
    setFilterType(filter);
  }, []);

  const handleUpdateTodo = useCallback(async (
    todo: Todo,
    fieldsToUpdate: UpdateData,
  ) => {
    setProcessedTodos(currentTodos => [...currentTodos, todo]);
    try {
      await updateTodo(todo.id, fieldsToUpdate);
      await fetchUserTodos();
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodos(currentTodos => (
        currentTodos.filter(currTodo => currTodo.id !== todo.id)));
    }
  }, []);

  const activeTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterTypes.ACTIVE);
  }, [todos]);
  const completedTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterTypes.COMPLETED);
  }, [todos]);
  const hasActiveTodos = activeTodos.length > 0;

  const handleToggleAll = useCallback(async () => {
    if (hasActiveTodos) {
      try {
        setProcessedTodos((currentTodos) => [...currentTodos, ...activeTodos]);

        await Promise.all(
          activeTodos.map(({ id }) => updateTodo(id, { completed: true })),
        );
        await fetchUserTodos();
      } catch {
        setErrorMessage(ErrorMessage.UPDATE);
      } finally {
        setProcessedTodos([]);
      }

      return;
    }

    try {
      setProcessedTodos((currentTodos) => [...currentTodos, ...todos]);

      await Promise.all(
        todos.map(({ id }) => updateTodo(id, { completed: false })),
      );
      await fetchUserTodos();
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodos([]);
    }
  }, [activeTodos, todos]);

  const changeHasError = useCallback((value: boolean) => (
    setHasError(value)
  ), []);

  const deleteAllCompleted = useCallback(async () => {
    try {
      setProcessedTodos((currentTodos) => [...currentTodos, ...completedTodos]);
      await Promise.all(
        completedTodos.map(todo => handleDelete(todo)),
      );
      await fetchUserTodos();
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessedTodos([]);
    }
  }, [completedTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: !hasActiveTodos,
            })}
            onClick={handleToggleAll}
          />

          <AddTodoForm
            handleAddTodo={handleAddTodo}
            inputDisabled={inputDisabled}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDelete={handleDelete}
              processedTodos={processedTodos}
              handleUpdateTodo={handleUpdateTodo}
            />

            <Footer
              filterType={filterType}
              handleFilterType={handleFilterType}
              hasCompletedTodos={completedTodos.length > 0}
              deleteAllCompleted={deleteAllCompleted}
              activeTodos={activeTodos}
            />
          </>
        )}
      </div>

      <Notification
        hasError={hasError}
        changeHasError={changeHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
