import React, { forwardRef } from 'react';

interface Props {
  title: string;
  onChangeTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export const NewTodo = forwardRef<HTMLInputElement, Props>(
  ({ title, onChangeTitle, onSubmit, disabled }, ref) => {
    return (
      <form onSubmit={onSubmit}>
        <input
          autoFocus
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          value={title}
          disabled={disabled}
          onChange={e => onChangeTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    );
  },
);

NewTodo.displayName = 'NewTodo';
