import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  todos: Todo[];
  handleToggleAll: () => void;
}

const Header: React.FC<HeaderProps> = ({
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  handleSubmit,
  isSubmitting,
  todos,
  handleToggleAll,
}) => {
  // Перевіряємо, чи всі завдання завершені
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        ></button>
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
          autoFocus
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};

export default Header;
