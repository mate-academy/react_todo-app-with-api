/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, getTodos, updateTodo, USER_ID } from '../api/todos';
import TodoList from './TodoList';
import ErrorNotification from './ErrorNotification';
import { Errors } from '../types/Error';
import { useError } from '../hooks/useError';
import Header from './Header';
import Loader from './Loader';

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTitle, setTempTitle] = useState<string>('');
  const [errorMessage, setError] = useError();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const allCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleDelete(ids: number | number[]) {
    if (Array.isArray(ids)) {
      setTodos(todos.filter(todo => !ids.includes(todo.id)));
    } else {
      setTodos(todos.filter(todo => todo.id !== ids));
    }

    inputRef.current?.focus();
  }

  function handleTodoError(message: Errors) {
    setError(message);
  }

  function handleUpdateTodo(item: Todo) {
    setTodos(
      todos.map(todo => {
        if (todo.id === item.id) {
          return item;
        }

        return todo;
      }),
    );
  }

  async function handleToggleAll() {
    const areCompleted = todos.every(todo => todo.completed);

    try {
      const dataToUpdate = areCompleted
        ? todos
        : todos.filter(todo => !todo.completed);

      setLoadingIds(dataToUpdate.map(item => item.id));
      const response = await Promise.allSettled(
        dataToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !todo.completed }),
        ),
      );

      const updatedData = todos.map(todo => {
        const result = response.find(
          res => res.status === 'fulfilled' && res.value.id === todo.id,
        );

        if (result && result.status === 'fulfilled') {
          return result.value;
        } else {
          return todo;
        }
      });

      setTodos(updatedData);

      const isFailed = response.some(req => req.status === 'rejected');

      if (isFailed) {
        throw new Error(Errors.UpdateTodo);
      }
    } catch (err) {
      setError(Errors.UpdateTodo);
    } finally {
      setLoadingIds([]);
    }
  }

  function handleLoadingIds(ids: number[]) {
    setLoadingIds(ids);
  }

  async function createTodo(title: string) {
    try {
      if (inputRef.current) {
        inputRef.current.disabled = true;

        const newTodo: Omit<Todo, 'id'> = {
          title,
          userId: USER_ID,
          completed: false,
        };

        setTempTitle(title);
        handleLoadingIds([0]);

        const data = await addTodo(newTodo);

        handleLoadingIds([]);
        inputRef.current.value = '';
        setTodos(prevTodos => [...prevTodos, data]);
      }
    } catch (err) {
      setError(Errors.AddTodo);
    } finally {
      setTempTitle('');
      inputRef.current!.disabled = false;
      inputRef.current?.focus();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get('todo') as string;

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setError(Errors.EmptyTitle);

      return;
    }

    await createTodo(preparedTitle);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError(Errors.FetchError);
      } finally {
        setIsLoading(false);
      }
    }

    inputRef.current?.focus();
    fetchData();
  }, [setError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          isListEmpty={todos.length === 0}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
          ref={inputRef}
        />
      </div>
      {isLoading && <Loader styles="mx-auto" />}
      {!isLoading && (
        <TodoList
          todos={todos}
          tempTitle={tempTitle}
          handleDelete={handleDelete}
          handleTodoError={handleTodoError}
          onUpdateTodo={handleUpdateTodo}
          onSetLoading={handleLoadingIds}
          loadingIds={loadingIds}
        />
      )}
      <ErrorNotification
        erorrMessage={errorMessage}
        clearError={() => setError(Errors.Default)}
      />
    </div>
  );
}

export default HomePage;
