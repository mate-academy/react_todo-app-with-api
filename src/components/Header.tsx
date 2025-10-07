import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTitle: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  allCompleted: boolean;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  todos: Todo[];
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  newTitle,
  onChange,
  onSubmit,
  allCompleted,
  isAdding,
  inputRef,
  handleToggleAll,
  todos,
  loading,
}) => (
  <header className="todoapp__header">
    {!loading && todos.length > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />
    )}

    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => onChange(e.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
