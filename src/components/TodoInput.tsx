import React from 'react';

interface TodoInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (title: string) => void;
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  disableInput: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  inputRef,
  title,
  setTitle,
  addTodo,
  disableInput,
}) => (
  <form onSubmit={addTodo}>
    <input
      ref={inputRef}
      value={title}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      autoFocus
      onChange={event => setTitle(event.target.value)}
      disabled={disableInput}
    />
  </form>
);
