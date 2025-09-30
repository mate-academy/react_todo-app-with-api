import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';

interface Props {
  todos: Todo[];
  onToggleAll: () => void;
  setErrorMessage: (message: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  userId: number;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  onToggleAll,
  setErrorMessage,
  setTodos,
  userId,
  setLoadingIds,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId,
      title: title.trim(),
      completed: false,
    };

    const tempTodoId = 0;

    setLoadingIds(prev => [...prev, tempTodoId]);
    setTitle('');

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== tempTodoId));
    }
  };

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
