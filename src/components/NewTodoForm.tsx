import React, { forwardRef } from 'react';

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export const NewTodoForm = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onSubmit, disabled }, ref) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      </form>
    );
  },
);

NewTodoForm.displayName = 'NewTodoForm';
