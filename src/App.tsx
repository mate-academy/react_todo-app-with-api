/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosApi from './api/todos';
import { ErrorType } from './types/ErrorTypes';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Main } from './components/Main';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [newTitle, setNewTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todosApi.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LoadingError);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    switch (status) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [status, todos]);

  function enableTodoProcessing(todoId: number) {
    setProcessingTodoIds(current => [...current, todoId]);
  }

  function disableTodoProcessing(todoId: number) {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  }

  async function addTodo() {
    const newTodo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: todosApi.USER_ID,
    };

    enableTodoProcessing(newTodo.id);
    setTodos(current => [...current, newTodo]);

    todosApi.createTodo(newTitle)
      .then(createdTodo => {
        // replace todo with id 0 to todo recieved from api
        setTodos(current => current.map(todo => (
          todo.id === newTodo.id ? createdTodo : todo
        )));
      })
      .catch((error) => {
        setErrorMessage(ErrorType.AddingError);
        setTodos(current => current.filter(
          todo => todo.id !== newTodo.id,
        ));

        throw error;
      })
      .finally(() => {
        disableTodoProcessing(newTodo.id);
      });
  }

  const deleteTodo = (todoId: number) => {
    enableTodoProcessing(todoId);

    todosApi.deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(
          todo => todo.id !== todoId,
        ));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DeletingError);
      })
      .finally(() => {
        disableTodoProcessing(todoId);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      setErrorMessage(ErrorType.TitleError);

      return;
    }

    addTodo()
      .then(() => {
        setNewTitle('');
      });

    setNewTitle('');
  };

  const toggleTodo = (toggledTodo: Todo) => {
    enableTodoProcessing(toggledTodo.id);

    todosApi.updateTodo({
      ...toggledTodo,
      completed: !toggledTodo.completed,
    })
      .then((updatedTodo) => {
        setTodos(current => current.map(todo => (
          todo.id === updatedTodo.id ? updatedTodo : todo
        )));
      })
      .finally(() => {
        disableTodoProcessing(toggledTodo.id);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const clearCompleted = () => completedTodos
    .forEach(({ id }) => deleteTodo(id));

  const hasActiveTodo = todos.some(todo => todo.completed);

  const handleToggle = () => {
    todos.forEach(todo => {
      toggleTodo({ ...todo, completed: !hasActiveTodo });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleToggle={handleToggle}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleSubmit}
          completed={completedTodos.length === todos.length}
        />
        <Main
          todos={visibleTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          processedTodos={processingTodoIds}
        />

        <Footer
          todos={visibleTodos}
          status={status}
          setStatus={setStatus}
          clearCompleted={clearCompleted}
        />
      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
