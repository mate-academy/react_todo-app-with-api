import React, { useState } from 'react';

interface Props {
  onAddTodo: (title: string) => Promise<void>;
  onError: (error: string | null) => void;
}

export const Header: React.FC<Props> = ({ onAddTodo, onError }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    onAddTodo(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <header className="header">
      <h1>todos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
