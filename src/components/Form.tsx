import React from 'react';

interface FormProps {
  loadingTodo: number | 'initial' | null;
  inputRef: React.RefObject<HTMLInputElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<FormProps> = ({
  handleSubmit,
  title,
  setTitle,
  inputRef,
  loadingTodo,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={loadingTodo !== null}
      />
    </form>
  );
};
