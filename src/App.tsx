/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { TodoStatus } from './utils/getFilteredTodos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>('All');
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [managingTodos, setManagingTodos] = useState<number[]>([]);

  const handleManagingTodos = (id: number) => {
    setManagingTodos(currentIds => [...currentIds, id]);
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(Error.UnableLoad);
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  /* eslint-disable */
  if (!todoService.USER_ID) {
    return <UserWarning />;
  }
  /* eslint-disable */

  const handleTypingTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleAddingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setError(Error.EmptyTitle);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    handleManagingTodos(0);

    todoService
      .createTodo(newTodo)
      .then(newAddedTodo => {
        setTodos(currentTodos => [...currentTodos, newAddedTodo]);
        setTitle('');
      })
      .catch(() => setError(Error.UnableAdd))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setManagingTodos(currentIds =>
          currentIds.filter(currentId => currentId !== 0),
        );
      });
  };

  const handleDeletingTodo = (id: number) => {
    handleManagingTodos(id);

    todoService
      .deleteTodo(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => setError(Error.UnableDelete))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setManagingTodos(currentIds =>
          currentIds.filter(deletedTodoId => deletedTodoId !== id),
        );
      });
  };

  const handleDeletingAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  const handleErrorNotifications = () => setError('');

  const handleTogglingTodo = (todo: Todo) => {
    handleManagingTodos(todo.id);

    todoService
      .updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setError(Error.UnableUpdate);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setManagingTodos(currentIds =>
          currentIds.filter(currentId => currentId !== todo.id),
        );
      });
  };

  const handleTogglingAllTodos = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(handleTogglingTodo);
    } else {
      completedTodos.forEach(handleTogglingTodo);
    }
  };

  // const handleUpdatingTodo = (todo: Todo) => {
  //   handleManagingTodos(todo.id);

  //   todoService
  //     .updateTodo(todo)
  //     .then(updatedTodo => {
  //       setTodos(currentTodos =>
  //         currentTodos.map(todo =>
  //           todo.id === updatedTodo.id ? updatedTodo : todo,
  //         ),
  //       );
  //     })
  //     .catch(() => setError(Error.UnableUpdate))
  //     .finally(() => {
  //       if (inputRef.current) {
  //         inputRef.current.disabled = false;
  //         inputRef.current.focus();
  //       }

  //       setManagingTodos(currentTodos =>
  //         currentTodos.filter(currentId => currentId !== todo.id),
  //       );
  //     });
  // };

  async function handleUpdatingTodo(todoToUpdate: Todo) {
    handleManagingTodos(todoToUpdate.id);

    try {
      const updatedTodo = await todoService.updateTodo(todoToUpdate);

      setTempTodo(null);

      setTodos(currentTodos => {
        return currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });
    } catch (error) {
      setError(Error.UnableUpdate);
      throw error;
    } finally {
      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }

      setManagingTodos(currentTodos =>
        currentTodos.filter(currentId => currentId !== todoToUpdate.id),
      );
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          handleAddingTodo={handleAddingTodo}
          title={title}
          handleTypingTodo={handleTypingTodo}
          handleTogglingAllTodos={handleTogglingAllTodos}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          status={status}
          handleDeletingTodo={handleDeletingTodo}
          managingTodos={managingTodos}
          handleUpdatingTodo={handleUpdatingTodo}
          handleTogglingTodo={handleTogglingTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            handleDeletingAllCompleted={handleDeletingAllCompleted}
            activeTodos={activeTodos}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        handleErrorNotifications={handleErrorNotifications}
      />
    </div>
  );
};
