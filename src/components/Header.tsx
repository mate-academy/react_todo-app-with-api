import React, { useEffect, useState } from 'react';
import { ErrorMessage } from '../types/types';

type Props = {
  onAdd: (title: string) => Promise<void>;
  onError: (message: string) => void;
  loading: boolean;
  isAllCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  onAdd,
  onError,
  loading,
  isAllCompleted,
  onToggleAll,
  hasTodos,
}) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    setDisabled(true);
    onError('');

    try {
      await onAdd(trimmedTitle);
      setTitle('');
    } catch {
    } finally {
      setDisabled(false);
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={disabled}
          value={title}
          onChange={event => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
