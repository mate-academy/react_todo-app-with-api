/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newTodoTitle.trim();

    if (!trimmed) {
      setErrorMessage("Title can't be empty");

      return;
    }

    try {
      const newTodo = await addTodo(trimmed);

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    try {
      const updated = await updateTodo(id, data);

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <header className="todoapp__header">
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
          />
        </form>
      </header>

      <TodoList todos={todos} onDelete={handleDelete} onUpdate={handleUpdate} />

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
