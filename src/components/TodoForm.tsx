import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => Promise<boolean>;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  isAdding,
  inputRef,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = inputValue.trim();

    const success = await onSubmit(title);

    if (success && title) {
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        disabled={isAdding}
        ref={inputRef}
        aria-label="Add new todo"
        autoFocus
      />
    </form>
  );
};
