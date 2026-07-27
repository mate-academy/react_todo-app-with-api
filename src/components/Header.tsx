import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todosCount: number;
  isAllCompleted: boolean;
  onAddTodo: (title: string) => Promise<void>;
  isDisabled: boolean;
  onError: (message: ErrorMessage) => void;
  loadingTodoIds: number[];
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => Promise<void>;
}

export const Header: React.FC<Props> = ({
  todosCount,
  isAllCompleted,
  onAddTodo,
  isDisabled,
  onError,
  loadingTodoIds,
  inputRef,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isDisabled && loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isDisabled, loadingTodoIds, inputRef]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.Title);

      return;
    }

    try {
      await onAddTodo(trimmedTitle);
      setTitle('');
    } catch {
    } finally {
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
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
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
