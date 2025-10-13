import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onToggleAll: () => Promise<void>;
  onAddTodo: (title: string) => Promise<void>;
  isAdding: boolean;
}

export const Header: React.FC<Props> = ({
  todos,
  onToggleAll,
  onAddTodo,
  isAdding,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || isAdding) {
      return;
    }

    await onAddTodo(title);
    setTitle('');
  };

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
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
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
