import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddTodo: () => void;
  allCompleted: boolean;
  handleToggleAll: () => void;
  isLoading: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  isCreating,
  inputRef,
  handleAddTodo,
  allCompleted,
  handleToggleAll,
  isLoading,
  todos,
}) => (
  <header className="todoapp__header">
    {!isLoading && todos.length > 0 && (
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
        handleAddTodo();
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        disabled={isCreating}
        ref={inputRef}
        autoFocus
      />
    </form>
  </header>
);
