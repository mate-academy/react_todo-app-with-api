/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/Todolist';
import { Footer } from './Components/Footer';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Notification } from './Components/Notification';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6376;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosToShow, setTodosToShow] = useState<Todo[]>(todos);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NONE);
  const [hasError, setHasError] = useState(false);
  const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false);

  const showError = (error: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(error);
  };

  const clearError = () => {
    setHasError(false);
  };

  const fetchTodos = async () => {
    try {
      setHasError(false);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError(ErrorMessages.ONLOAD);
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

  const handleAddTodo = async (inputQuery: string) => {
    clearError();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputQuery,
      completed: false,
    };

    setTodosToShow([
      ...todosToShow,
      newTodo]);

    try {
      await addTodo(USER_ID, newTodo);
      await fetchTodos();
    } catch (error) {
      showError(ErrorMessages.ONADD);
    }
  };

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (selectedStatus) {
        case 'all':
          return true;
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return todo;
      }
    });

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
      if (!isAllCompleted) {
        todosToShow.forEach(todo => {
          if (!todo.completed) {
            return handleUpdateTodo(todo.id, { completed: true });
          }

          return null;
        });
      } else {
        todosToShow.forEach(todo => handleUpdateTodo(
          todo.id,
          { completed: !todo.completed },
        ));
      }
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

  const handleToggleAllTodos = () => {
    toggleAllTodos();
  };

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
