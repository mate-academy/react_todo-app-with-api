/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
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
import { getActiveTodosId } from './utils/getActiveTodosId';
import { getCompletedTodosId } from './utils/getCompletedTodosId';
import { getFilteredTodos } from './utils/getFilteredTodos';

const USER_ID = 6359;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [processedTodosId, setProcessedTodosId] = useState<number[]>([]);

  const fetchUserTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessage.FIND);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchUserTodos();
  }, []);

  const handleAddTodo = async (todoTitle: string) => {
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
  };

  const handleDelete = async (todoId: number) => {
    setProcessedTodosId((currentIds) => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessedTodosId([]);
    }
  };

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleFilterType = (filter: FilterTypes) => {
    setFilterType(filter);
  };

  const handleUpdateTodo = async (
    todoId: number,
    fieldsToUpdate: UpdateData,
  ) => {
    setProcessedTodosId((currentIds) => [...currentIds, todoId]);

    try {
      await updateTodo(todoId, fieldsToUpdate);
      await fetchUserTodos();
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodosId([]);
    }
  };

  const hasCompletedTodos = getCompletedTodosId(todos).length > 0;
  const activeTodos = getActiveTodosId(todos);
  const hasActiveTodos = activeTodos.length > 0;

  const handleToggleAll = () => {
    if (hasActiveTodos) {
      activeTodos.forEach(
        ({ id }) => handleUpdateTodo(id, { completed: true }),
      );

      return;
    }

    todos.forEach(
      ({ id }) => handleUpdateTodo(id, { completed: false }),
    );
  };

  const changeHasError = (value: boolean) => setHasError(value);

  const deleteAllCompleted = async () => {
    const completedTodos = getCompletedTodosId(todos);

    await completedTodos.forEach(id => handleDelete(id));
  };

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
              processedTodosId={processedTodosId}
              handleUpdateTodo={handleUpdateTodo}
            />

            <Footer
              filterType={filterType}
              handleFilterType={handleFilterType}
              hasCompletedTodos={hasCompletedTodos}
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
