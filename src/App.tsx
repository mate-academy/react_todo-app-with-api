/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/Todolist';
import { Footer } from './Components/Footer';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Notification } from './Components/Notification';
import { ErrorMessages } from './types/ErrorMessages';
import { SelectedBy } from './types/SelectedBy';

const USER_ID = 6376;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosToShow, setTodosToShow] = useState<Todo[]>(todos);
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<SelectedBy>(SelectedBy.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NONE);
  const [hasError, setHasError] = useState(false);
  const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false);

  const showError = useCallback((error: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(error);
  }, [setHasError, setErrorMessage]);

  const clearError = () => {
    setHasError(false);
  };

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError(ErrorMessages.ONLOAD);
      setHasError(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    clearError();

    try {
      await deleteTodo(todoId);
      fetchTodos();
    } catch (error) {
      showError(ErrorMessages.ONDELETE);
    }
  };

  const handleAddTodo = useCallback(async (inputQuery: string) => {
    clearError();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputQuery,
      completed: false,
    };

    setTodosToShow([
      ...todosToShow,
      newTodo,
    ]);

    try {
      await addTodo(USER_ID, newTodo);
      await fetchTodos();
    } catch (error) {
      showError(ErrorMessages.ONADD);
    }
  }, [clearError, setTodosToShow, addTodo, fetchTodos, showError]);

  const filteringTodos = (
    todosToFilter: Todo[],
    selectedFilteringStatus: SelectedBy,
  ) => {
    return (todosToFilter.filter(todo => {
      switch (selectedFilteringStatus) {
        case SelectedBy.ALL:
          return true;
        case SelectedBy.ACTIVE:
          return !todo.completed;
        case SelectedBy.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    }));
  };

  useEffect(() => {
    const filteredTodos = filteringTodos(todos, selectedStatus);

    setTodosToShow(filteredTodos);
  }, [selectedStatus, todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleUpdateTodo = async (todoId: number, todo: Partial<Todo>) => {
    try {
      await updateTodo(todoId, todo);
      await fetchTodos();
    } catch (error) {
      showError(ErrorMessages.ONUPDATE);
    }
  };

  const toggleAllTodos = async () => {
    const isAllCompleted = todosToShow.every(todo => todo.completed);

    try {
      todosToShow.forEach(todo => {
        const newCompletedStatus = !isAllCompleted;

        handleUpdateTodo(todo.id, { completed: newCompletedStatus });
      });
    } catch {
      showError(ErrorMessages.ONTOGGLEALL);
    }
  };

  const clearCompletedTodos = async () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    const deleteCompletedTodos = async (todoId: number) => {
      clearError();

      try {
        await deleteTodo(todoId);
      } catch (error) {
        showError(ErrorMessages.ONDELETE);
      }
    };

    allCompletedTodos.forEach(todo => deleteCompletedTodos(todo.id));
    fetchTodos();
  };

  useEffect(() => {
    const isAllCompleted = todosToShow.every(todo => todo.completed);

    if (isAllCompleted) {
      setIsAllTodosCompleted(true);
    } else {
      setIsAllTodosCompleted(false);
    }
  }, [todosToShow]);

  const handleToggleAllTodos = useCallback(() => {
    toggleAllTodos();
  }, [toggleAllTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleAddTodo={handleAddTodo}
          showError={showError}
          handleToggleAllTodos={handleToggleAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        <TodoList
          todosToShow={todosToShow}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
        {todos.length > 0 && (
          <Footer
            todosToShow={todosToShow}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            clearCompletedTodos={clearCompletedTodos}
            setIsAllTodosCompleted={setIsAllTodosCompleted}
          />
        )}
      </div>
      <Notification
        hasError={hasError}
        errorMessage={errorMessage}
        clearError={clearError}
      />
    </div>
  );
};
