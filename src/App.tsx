/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './Components/ToDoList';
import { Notification } from './Components/errorNotification';
import { client } from './utils/fetchClient';

import { FilterType, Todo } from './types/Todo';

import { getTodos, deleteTodo } from './api/todos';

import { Footer } from './Components/Footer';

const USER_ID = 6340;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [isError, setIsError] = useState(false);
  const [inputQuery, setInputQuery] = useState('');

  const loadTodosData = async () => {
    try {
      setIsError(false);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setIsError(true);
    }
  };

  useEffect(() => {
    loadTodosData();
  }, []);

  const addNewTodo = async () => {
    if (inputQuery.trim() === '') {
      setIsError(true);

      return;
    }

    try {
      setIsError(false);
      const newTodo = {
        userId: USER_ID,
        title: inputQuery.trim(),
        completed: false,
      };

      const response = await client.post<Todo>('/todos', newTodo);

      setTodos([...todos, response]);
      setInputQuery('');
    } catch (error) {
      setIsError(true);
    }
  };

  const deleteTodoItem = async (todoId: number) => {
    try {
      setIsError(false);
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setIsError(true);
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
    return todos.filter((todo) => {
      switch (filterBy) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const updateTodoItem = async (todoId: number, updatedTodo: Todo) => {
    try {
      setIsError(false);
      await client.patch<Todo>(`/todos/${todoId}`, updatedTodo);

      setTodos(prevTodos => prevTodos.map(
        todo => (todo.id === todoId ? updatedTodo : todo),
      ));
    } catch (error) {
      setIsError(true);
    }
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
            />
          </>
        )}
      </div>

      {isError && <Notification isError={Boolean(isError)} />}
    </div>
  );
};
