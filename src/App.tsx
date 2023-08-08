/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './Components/ToDoList';
import { Notification } from './Components/errorNotification';
import { client } from './utils/fetchClient';
import { Error } from './types/Error';

import { FilterType, Todo } from './types/Todo';

import { getTodos, deleteTodo } from './api/todos';

import { Footer } from './Components/Footer';

const USER_ID = 6340;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<Error>(Error.NONE);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadTodosData = async () => {
    try {
      setError(Error.NONE);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.DOWNLOADING);
    }
  };

  useEffect(() => {
    loadTodosData();
  }, []);

  const addNewTodo = async () => {
    if (!inputQuery.trim()) {
      setError(Error.NONE);

      return;
    }

    try {
      setError(Error.NONE);
      setIsLoading(true);

      const newTodo = {
        userId: USER_ID,
        title: inputQuery.trim(),
        completed: false,
      };

      const response = await client.post<Todo>('/todos', newTodo);

      setTodos([...todos, response]);
      setInputQuery('');
    } catch {
      setError(Error.ADD);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodoItem = async (todoId: number) => {
    try {
      setError(Error.NONE);
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.DELETE);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewTodo();
  };

  const handleTodoDelete = (todoId: number) => {
    deleteTodoItem(todoId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);
  };

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case FilterType.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const updateTodoItem = async (todoId: number, updatedTodo: Todo) => {
    try {
      setError(Error.NONE);
      await client.patch<Todo>(`/todos/${todoId}`, updatedTodo);

      setTodos(prevTodos => prevTodos.map(
        todo => (todo.id === todoId ? updatedTodo : todo),
      ));
    } catch {
      setError(Error.UPDATE);
    }
  };

  const deleteAllCompletedTodos = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setError(Error.DELETE);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleToggleAll}
          />
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputQuery}
              onChange={handleInputChange}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleTodoDelete}
              onUpdate={updateTodoItem}
            />

            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={visibleTodos}
              onDelete={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader" />
        </div>
      )}

      {error && (
        <Notification
          error={error}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};
