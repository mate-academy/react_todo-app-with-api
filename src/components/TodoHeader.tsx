import React from 'react';

interface Props {
  title: string;
  isAdding: boolean;
  hasTodos: boolean;
  allCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  title,
  isAdding,
  hasTodos,
  allCompleted,
  inputRef,
  onTitleChange,
  onSubmit,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
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
          disabled={isAdding}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
