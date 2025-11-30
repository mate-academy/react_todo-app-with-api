import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

const NewTodoForm: React.FC<{
  onAdd: (title: string) => Promise<boolean>;
  disabled?: boolean;
  focusTrigger?: number;
}> = ({ onAdd, disabled = false, focusTrigger }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, focusTrigger]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const success = await onAdd(value);

    if (success) {
      setValue('');
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
    </form>
  );
};

export const Header: React.FC<{
  toggleAllActive: boolean;
  onToggleAll: () => Promise<void>;
  onAdd: (title: string) => Promise<boolean>;
  adding: boolean;
  focusTrigger?: number;
  todos: Todo[];
}> = ({ toggleAllActive, onToggleAll, onAdd, adding, focusTrigger, todos }) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          className={`todoapp__toggle-all ${toggleAllActive ? 'active' : ''}`}
          onClick={onToggleAll}
        />
      )}

      <NewTodoForm
        onAdd={onAdd}
        disabled={adding}
        focusTrigger={focusTrigger}
      />
    </header>
  );
};
