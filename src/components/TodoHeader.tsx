import React from 'react';

type Props = {
  newTodo: string;
  setNewTodo: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setErrorMessage: (msg: string) => void;
  areAllCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  onSubmit,
  isDisabled,
  inputRef,
  setErrorMessage,
  areAllCompleted,
  onToggleAll,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          disabled={isDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => {
            setNewTodo(e.target.value);
            setErrorMessage('');
          }}
        />
      </form>
    </header>
  );
};
