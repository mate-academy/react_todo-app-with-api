import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  isAllCompleted: boolean;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  hasTodos,
  isAllCompleted,
  title,
  onTitleChange,
  onSubmit,
  isSubmitting,
  inputRef,
  onToggleAll,
}) => (
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

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isSubmitting}
        autoFocus
      />
    </form>
  </header>
);
