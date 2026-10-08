import React, { useState } from 'react';
import { ERROR_MESSAGES } from '../types/ErrorMessage';
import type { ErrorMessageType } from '../types/ErrorMessage';

type Props = {
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAdd: (title: string) => Promise<boolean>;
  onError: (error: ErrorMessageType | null) => void;
};

export const NewTodo: React.FC<Props> = ({
  isSubmitting,
  inputRef,
  onAdd,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitle('');
      onError(ERROR_MESSAGES.TITLE);

      return;
    }

    const added = await onAdd(trimmedTitle);

    if (added) {
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};
