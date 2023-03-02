import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { getTodos, addTodo, removeTodo, updateTodo } from './api/todos';

import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorTypes } from './types/ErrorTypes';
import { RequestTodo } from './types/RequestTodo';

export const USER_ID = 6341;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [loading, setLoading] = useState({ todoId: 0, isLoading: false });

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorTypes.UPLOAD_ERROR);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addNewTodo = async (title: string) => {
    if (!title) {
      setError(ErrorTypes.EMPTY_TITLE);

      return;
    }

    const newTodo: RequestTodo = {
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      await addTodo(USER_ID, newTodo);
      await getTodosFromServer();
    } catch {
      setError(ErrorTypes.ADD_ERROR);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoading({ todoId, isLoading: true });
      await removeTodo(todoId);
    } catch {
      setError(ErrorTypes.DELETE_ERROR);
    } finally {
      await getTodosFromServer();
      setLoading({ todoId: 0, isLoading: false });
    }
  };

  const deleteCompletedTodos = (deletedTodos: Todo[]) => {
    deletedTodos.map(todo => deleteTodo(todo.id));
  };

  const toggleStatusTodo = async (todo: Todo) => {
    try {
      setLoading({ todoId: todo.id, isLoading: true });
      await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
    } catch {
      setError(ErrorTypes.UPDATE_ERROR);
    } finally {
      await getTodosFromServer();
      setLoading({ todoId: 0, isLoading: false });
    }
  };

  const toggleAllTodos = (toggledTodos: Todo[]) => {
    toggledTodos.map(todo => toggleStatusTodo(todo));
  };

  const renameTodo = async (todo: Todo, newTitle: string) => {
    try {
      setLoading({ todoId: todo.id, isLoading: true });
      await updateTodo(todo.id, {
        ...todo,
        title: newTitle,
      });
    } catch {
      setError(ErrorTypes.UPDATE_ERROR);
    } finally {
      await getTodosFromServer();
      setLoading({ todoId: 0, isLoading: false });
    }
  };

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.ACTIVE:
        return !todo.completed;

      case Status.COMPLETED:
        return todo.completed;

      case Status.ALL:
        return true;

      default:
        throw new Error('Unexpected status');
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={addNewTodo}
          toggleAllTodos={toggleAllTodos}
        />

        <TodosList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          toggleStatusTodo={toggleStatusTodo}
          renameTodo={renameTodo}
          loading={loading}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {error !== ErrorTypes.NONE && (
        <Notification
          error={error}
        />
      )}
    </div>
  );
};
