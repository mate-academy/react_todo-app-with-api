import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  loading: boolean;
  onAdd: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onToggleAll: () => void;
};

function Header({
  loading,
  onAdd,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  todos,
  onToggleAll,
}: Props) {
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [loading, inputRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onAdd(newTodoTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          disabled={loading}
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
}

export default Header;
