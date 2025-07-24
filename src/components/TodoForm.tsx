import React, { useEffect, useMemo, useRef } from 'react';
import { Todo } from '../types/Todo';

interface FormProps {
  todos: Todo[];
  newNoteTitle: string;
  onTyping: (title: string) => void;
  onAdd: (e: React.FormEvent) => Promise<void>;
  onToggle: () => void;
  disabled: boolean;
}

export const TodoForm: React.FC<FormProps> = ({
  todos,
  newNoteTitle,
  onTyping,
  onAdd,
  onToggle,
  disabled,
}) => {
  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(t => t.completed),
    [todos],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, newNoteTitle, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      )}

      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newNoteTitle}
          onChange={e => onTyping(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
