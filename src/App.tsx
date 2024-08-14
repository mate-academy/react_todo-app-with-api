/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { ToDoList } from './components/TodoList';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { filterTodos } from './utils/filterTodos';
import { ErrorMessages } from './types/ErrorsMessages';

const initialTodo = {
  userId: postService.USER_ID,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [idTodo, setIdTodo] = useState(0);
  const [newTodo, setNewTodo] = useState(initialTodo);
  const [loading, setLoading] = useState(false);

  const activeTodos = todosFromServer.filter(
    todo => !todo.completed && todo.id,
  );
  const completedTodos = todosFromServer.filter(todo => todo.completed);

  useEffect(() => {
    postService
      .getTodos()
      .then(todosArr => {
        setTodosFromServer(todosArr);
        setTodos(todosArr);
      })
      .catch(() => setErrorMessage(ErrorMessages.UNABLE_TO_LOAD_TODOS))
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const handleChangeTitle = (value: string) => {
    setErrorMessage('');
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: value,
    }));
  };

  const reset = () => {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: '',
    }));
  };

  const filteredTodos = useCallback(() => {
    return filterTodos(todosFromServer, status);
  }, [status, todosFromServer]);

  useEffect(() => {
    setTodos(filteredTodos());
  }, [filteredTodos]);

  function onDeleteTodo(todoId: number) {
    setErrorMessage('');
    setIdTodo(todoId);

    return postService
      .deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(error => {
        setTodosFromServer(todos);
        setErrorMessage(ErrorMessages.UNABLE_TO_DELETE_TODO);
        throw error;
      });
  }

  function onCreateTodo(newToDo: Omit<Todo, 'id'>) {
    setErrorMessage('');
    const trimmedTodo = { ...newToDo, title: newToDo.title.trim() };

    setTodosFromServer(currentTodos => [
      ...currentTodos,
      { ...trimmedTodo, id: 0 },
    ]);
    setIdTodo(0);

    return postService
      .createTodo(trimmedTodo)
      .then(todo => {
        setTodosFromServer(currentTodos => [
          ...currentTodos.filter(currentTodo => currentTodo.id),
          todo,
        ]);
      })
      .catch(error => {
        setErrorMessage(ErrorMessages.UNABLE_TO_ADD_TODO);
        setTodosFromServer(todos);
        throw error;
      });
  }

  function onUpdateTodo(updateTodo: Todo) {
    setErrorMessage('');

    return postService
      .updateTodo(updateTodo)
      .then(() => {
        setTodosFromServer(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updateTodo.id ? updateTodo : todo,
          );
        });
      })
      .catch(error => {
        setErrorMessage(ErrorMessages.UNABLE_TO_UPDATE_TODO);
        setTodosFromServer(todos);
        throw error;
      });
  }

  async function clearCompletedTodo() {
    completedTodos.map(async completedTodo => {
      await postService
        .deleteTodo(completedTodo.id)
        .then(() => {
          setTodosFromServer(currentTodos => {
            return currentTodos.filter(todo => todo.id !== completedTodo.id);
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UNABLE_TO_DELETE_TODO);
        });
    });
  }

  const toggleAll = async () => {
    setLoading(true);
    let todosToToggle = todosFromServer;

    if (activeTodos.length > 0) {
      todosToToggle = activeTodos;
    }

    const togglePromises = todosToToggle.map(async todo => {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      return postService.updateTodo(updatedTodo);
    });

    try {
      const updatedTodos = await Promise.all(togglePromises);

      setTodosFromServer(currentTodos => {
        return currentTodos.map(todo => {
          const updatedTodo = updatedTodos.find(
            update => update.id === todo.id,
          );

          return updatedTodo || todo;
        });
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.UNABLE_TO_UPDATE_TODO);
    } finally {
      setLoading(false);
    }
  };

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          loading={loading}
          todo={newTodo}
          todosFromServer={todosFromServer}
          todos={todos}
          leftTodos={activeTodos}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={setErrorMessage}
          onLoading={setLoading}
          toggleAll={toggleAll}
        />

        <ToDoList
          todos={todos}
          idTodo={idTodo}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
          onLoading={setLoading}
          onError={setErrorMessage}
          onIdTodo={setIdTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            onClick={setStatus}
            status={status}
            activeTodos={activeTodos.length}
            completedTodos={completedTodos}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
