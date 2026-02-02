import React, { useState, useRef } from 'react';

type Props = {
  onAdd: (title: string) => Promise<unknown> | void;
  allCompleted: boolean;
  onToggleAll: () => void;
  isAdding?: boolean;
  onInvalid?: () => void;
  registerFocus?: (fn: () => void) => void;
  showToggleAll?: boolean;
};

export const Header: React.FC<Props> = ({
  onAdd,
  allCompleted,
  onToggleAll,
  isAdding = false,
  onInvalid,
  registerFocus,
  showToggleAll = true,
}) => {
  const [todo, setTodo] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    registerFocus?.(() => {
      inputRef.current?.focus();
    });
  }, [registerFocus]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = todo.trim();

    if (!trimmed) {
      onInvalid?.();
      requestAnimationFrame(() => inputRef.current?.focus());

      return;
    }

    try {
      await onAdd(trimmed);
      // clear input only on success
      setTodo('');
    } catch (err) {
      // keep the entered text on failure — tests expect this behavior
      // optionally show error handling is done in parent (App)
    } finally {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <header className="todoapp__header">
      {showToggleAll && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          aria-label="Toggle all todos"
          disabled={isAdding}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={todo}
          onChange={event => setTodo(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
