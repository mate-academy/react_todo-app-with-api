import React from 'react';
import cn from 'classnames';

interface TodoFormProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  title,
  onTitleChange,
  onSubmit,
  isDisabled,
  inputRef,
  hasTodos,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
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
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
