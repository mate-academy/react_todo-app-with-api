import React, { useState, useEffect, useMemo } from 'react';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getVisibleTodos } from './utils/helper';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Header } from './components/Header';
import { clearNotification } from './utils/clearNotification';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6356;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [
    errorMessage,
    setErrorMessage] = useState<ErrorMessage>(ErrorMessage.None);
  const [
    selectedFilter,
    setSelectedFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);

  const handleError = (error: ErrorMessage) => {
    setErrorMessage(error);
  };

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      handleError(ErrorMessage.Upload);
      clearNotification(handleError, 3000);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(selectedFilter, todos)
  ), [todos, selectedFilter]);
  const isCompleted = visibleTodos.some(todo => todo.completed);
  const isAllCompleted = visibleTodos.length > 0
    ? visibleTodos.every(todo => todo.completed)
    : false;
  const countOfActive = visibleTodos.filter(todo => !todo.completed).length;

  const addTodo = async (title: string) => {
    if (!title) {
      handleError(ErrorMessage.Title);
      clearNotification(handleError, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      setIsInputDisabled(true);
      await createTodo(USER_ID, newTodo);
      await getTodosFromServer();
    } catch (error) {
      handleError(ErrorMessage.Add);
      clearNotification(handleError, 3000);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const removeTodo = async (todoToRemove: Todo) => {
    const { id } = todoToRemove;

    try {
      setProcessedTodos(curTodos => [...curTodos, todoToRemove]);
      await deleteTodo(USER_ID, id);
      await getTodosFromServer();
    } catch (error) {
      handleError(ErrorMessage.Delete);
      clearNotification(handleError, 3000);
    } finally {
      setProcessedTodos(curTodos => curTodos.filter(todo => todo.id !== id));
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => removeTodo(todo)));
      await getTodosFromServer();
    } catch (error) {
      handleError(ErrorMessage.Delete);
      clearNotification(handleError, 3000);
    }
  };

  const editStatusOfTodo = async (
    todoToEdit: Todo,
    status: boolean,
  ) => {
    const { id } = todoToEdit;

    try {
      setProcessedTodos(curTodos => [...curTodos, todoToEdit]);
      await updateTodoStatus(USER_ID, id, status);
      await getTodosFromServer();
    } catch (error) {
      handleError(ErrorMessage.Update);
      clearNotification(handleError, 3000);
    } finally {
      setProcessedTodos(curTodos => curTodos.filter(todo => todo.id !== id));
    }
  };

  const editStatusOfAllTodos = async () => {
    try {
      if (isAllCompleted) {
        await Promise.all(visibleTodos.map(todo => (
          editStatusOfTodo(todo, false))));
      } else {
        const activeTodos = visibleTodos.filter(todo => !todo.completed);

        await Promise.all(activeTodos.map(todo => (
          editStatusOfTodo(todo, true))));
      }

      await getTodosFromServer();
    } catch (error) {
      handleError(ErrorMessage.Update);
      clearNotification(handleError, 3000);
    }
  };

  const editTitleOfTodo = async (
    todoToEdit: Todo,
    title: string,
  ) => {
    if (!title) {
      await removeTodo(todoToEdit);

      return;
    }

    const { id } = todoToEdit;

    try {
      setProcessedTodos(curTodos => [...curTodos, todoToEdit]);
      await updateTodoTitle(USER_ID, id, title);
      await getTodosFromServer();
    } catch (errror) {
      handleError(ErrorMessage.Update);
      clearNotification(handleError, 3000);
    } finally {
      setProcessedTodos(curTodos => curTodos.filter(todo => todo.id !== id));
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
          addTodo={addTodo}
          isAllCompleted={isAllCompleted}
          isInputDisabled={isInputDisabled}
          editStatusOfAllTodos={editStatusOfAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={removeTodo}
          onEditStatus={editStatusOfTodo}
          tempTodo={tempTodo}
          onEditTitle={editTitleOfTodo}
          processedTodos={processedTodos}
        />

        {!!todos.length && (
          <Footer
            selectedFilter={selectedFilter}
            handleFilterChange={handleFilterChange}
            isCompleted={isCompleted}
            deleteCompletedTodos={deleteCompletedTodos}
            countOfActive={countOfActive}
          />
        )}

      </div>

      <Notifications
        handleError={handleError}
        errorMessage={errorMessage}
      />

    </div>
  );
};
