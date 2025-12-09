import React from 'react';

export interface TodoHeaderProps {
  allCompleted: boolean;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  handleAddTodo: (e: React.FormEvent) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  loading: boolean;
  hasTodos: boolean;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  allCompleted,
  newTitle,
  setNewTitle,
  isSubmitting,
  handleAddTodo,
  inputRef,
  handleToggleAll,
  hasTodos,
  loading,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && !loading && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          aria-pressed={allCompleted}
        >
          All
        </button>
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder={allCompleted ? 'All done!' : 'What needs to be done?'}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
