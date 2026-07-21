import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  onAddTodo: (title: string) => Promise<void>;
  onError: (message: ErrorMessage | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllCompleted?: boolean;
  onToggleAll?: () => void;
  hasTodos?: boolean;
}

export const Header: React.FC<Props> = ({
  onAddTodo,
  onError,
  inputRef,
  isAllCompleted = false,
  onToggleAll,
  hasTodos = false,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.TITLE);

      return;
    }

    setIsSubmitting(true);
    onError(null);

    onAddTodo(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isSubmitting}
          autoFocus
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
