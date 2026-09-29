import React, { useState, useEffect, useRef } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import cn from 'classnames';

type Props = {
  onError: (error: ErrorMessage) => void;
  onAddTodo: (title: string) => void;
  isAdding: boolean;
  isAddSuccessful: boolean;
  isDeleting: boolean;
  areAllTodosCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  onError,
  onAddTodo,
  isAdding,
  isAddSuccessful,
  isDeleting,
  areAllTodosCompleted,
  onToggleAll,
  hasTodos,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddSuccessful) {
      setTitle('');
    }
  }, [isAddSuccessful]);

  useEffect(() => {
    if (!isAdding && !isDeleting) {
      inputRef.current?.focus();
    }
  }, [isAdding, isDeleting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    onAddTodo(trimmedTitle);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
