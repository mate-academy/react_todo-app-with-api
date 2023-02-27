import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodos,
  deleteTodo,
  getTodos,
  updateTodoName,
  updateTodoStatus,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notifications';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/errorMessages';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { getVisibleTodos } from './utils/PreparedTodo';

const USER_ID = 6386;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasServerError, setHasServerError] = useState(false);
  const [status, setStatus] = useState<Status>(Status.All);
  const [name, setName] = useState('');
  const [errorType, setErrorType] = useState<ErrorMessages>(ErrorMessages.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState(0);
  const [loadingForToggle, setLoadingForToggle] = useState(false);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, status);
  }, [todos, status]);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setHasServerError(true);
      setErrorType(ErrorMessages.LOAD);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const handleAddTodo = async (todoName: string) => {
    if (todoName.length === 0) {
      setErrorType(ErrorMessages.TITLE);

      return;
    }

    const todoToAdd = {
      userId: USER_ID,
      title: todoName,
      completed: false,
    };

    try {
      setIsDisableInput(true);
      setName('');
      const newTodo = await addTodos(USER_ID, todoToAdd);

      setTempTodo(newTodo);
      await getTodosFromServer();
    } catch {
      setHasServerError(true);
      setErrorType(ErrorMessages.ADD);
    } finally {
      setIsDisableInput(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoToDelete: Todo) => {
    try {
      await deleteTodo(USER_ID, todoToDelete.id);

      await getTodosFromServer();
    } catch {
      setHasServerError(true);
      setErrorType(ErrorMessages.DELETE);
    }
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo);
      }
    });
  };

  const handleUpdateTodoStatus = async (todoUpdate: Todo) => {
    const newStatus = !todoUpdate.completed;

    try {
      setUpdatingTodoId(todoUpdate.id);

      const changedTodo: Todo = await updateTodoStatus(
        USER_ID,
        todoUpdate.id,
        newStatus,
      );

      setTodos(currentTodos => (
        currentTodos.map(todo => (
          todo.id === todoUpdate.id
            ? changedTodo
            : todo
        ))
      ));
    } catch {
      setErrorType(ErrorMessages.UPDATE);
    } finally {
      setUpdatingTodoId(0);
      setLoadingForToggle(false);
    }
  };

  const handleToggleAllStatus = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos
      .filter(todo => todo.completed !== !isAllCompleted);

    todosToUpdate.forEach(todo => {
      handleUpdateTodoStatus(todo);
    });
  };

  const handleUpdateTodoName = async (
    todoToUpdate: Todo,
    newName: string,
  ) => {
    try {
      setUpdatingTodoId(todoToUpdate.id);

      const changerTodo: Todo = await updateTodoName(
        USER_ID,
        todoToUpdate.id,
        newName,
      );

      setTodos(currentTodos => {
        return currentTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? changerTodo
            : todo
        ));
      });
    } catch {
      setErrorType(ErrorMessages.UPDATE);
    } finally {
      setUpdatingTodoId(0);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          name={name}
          setName={setName}
          handleAddTodo={handleAddTodo}
          isDisableInput={isDisableInput}
          toggleAll={handleToggleAllStatus}
          setLoadingForToggle={setLoadingForToggle}
        />
        <TodoList
          todos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          updatingTodoId={updatingTodoId}
          handleUpdateTodoName={handleUpdateTodoName}
          loadingForToggle={loadingForToggle}
        />

        {(todos.length > 0 || !!tempTodo) && (
          <Footer
            todos={visibleTodos}
            status={status}
            setStatus={setStatus}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}

      </div>
      {hasServerError && (
        <Notification
          errorType={errorType}
          hasError={hasServerError}
          setHasError={setHasServerError}
        />
      ) }
    </div>
  );
};
