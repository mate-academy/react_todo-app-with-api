import React from 'react';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (title: string) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoForm: React.FC<Props> = ({
  onSubmit,
  title,
  setTitle,
  disabled,
  inputRef,
}) => (
  <form onSubmit={onSubmit}>
    <input
      ref={inputRef}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={e => setTitle(e.target.value)}
      disabled={disabled}
    />
  </form>
);
