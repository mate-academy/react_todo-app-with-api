import React from 'react';

type Props = {
  createTodo: (event: React.FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  inputTitle: string;
  setInputTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const Form: React.FC<Props> = ({
  createTodo,
  newTodoField,
  inputTitle,
  setInputTitle,
}) => {
  return (
    <form onSubmit={createTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTitle}
        onChange={event => setInputTitle(event.target.value)}
      />
    </form>
  );
};
