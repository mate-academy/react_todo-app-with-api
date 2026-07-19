import React, { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  areAllCompleted: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  isSubmitting,
  inputRef,
  onToggleAll,
  areAllCompleted,
  hasTodos,
}) => {
  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: areAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
