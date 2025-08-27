import React from 'react';

type Props = {
  todosCount: number;
  allCompleted: boolean;
  isSubmitting: boolean;
  newTodoTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeTitle: (value: string) => void;
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todosCount,
  allCompleted,
  isSubmitting,
  newTodoTitle,
  inputRef,
  onSubmit,
  onChangeTitle,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {todosCount > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        onClick={onToggleAll}
        data-cy="ToggleAllButton"
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={newTodoTitle}
        ref={inputRef}
        onChange={e => onChangeTitle(e.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isSubmitting}
      />
    </form>
  </header>
);
