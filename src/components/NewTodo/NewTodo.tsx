// File: src/components/NewTodo/NewTodo.tsx
import { useEffect } from 'react';

type Props = {
  value: string;
  disabled?: boolean; // from parent: creating (keep it)
  onChange: (v: string) => void;
  onCreate: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isEditing?: boolean;
};

export const NewTodo: React.FC<Props> = ({
  value,
  disabled = false,
  onChange,
  onCreate,
  inputRef,
  isEditing,
}) => {
  // Only focus NewTodo if not editing (parent should pass isEditing if needed)
  useEffect(() => {
    if (!disabled && !isEditing) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled, isEditing, inputRef]);

  // Synchronous disable on Enter keydown (before submit fires)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      inputRef.current?.focus();

      return;
    }
    // Parent disables via prop, so no local state needed
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(value); // parent will set creating=true first
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="todoapp__new-todo"
        data-cy="NewTodoField"
        placeholder="What needs to be done?"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </form>
  );
};
