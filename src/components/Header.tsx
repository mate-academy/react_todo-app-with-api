import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { ERRORS } from '../utils/errors';

interface HeaderProps {
  onAdd: (title: string) => Promise<boolean>;
  isSubmitting: boolean;
  onError?: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean;
  onToggleAll: () => Promise<void>;
  todosLength: number;
}

export const Header: React.FC<HeaderProps> = ({
  onAdd,
  isSubmitting,
  onError,
  inputRef,
  isAllCompleted,
  onToggleAll,
  todosLength,
}) => {
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting, inputRef]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = currentTitle.trim();

    if (!trimmedTitle) {
      onError?.(ERRORS.Title);

      return;
    }

    if (isSubmitting) {
      return;
    }

    const isSuccess = await onAdd(trimmedTitle);

    if (isSuccess) {
      setCurrentTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={currentTitle}
          onChange={e => setCurrentTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
