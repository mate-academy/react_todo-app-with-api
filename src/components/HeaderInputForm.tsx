import React, { useRef } from 'react';

type Props = {
  handleSubmit : (event: React.FormEvent) => void;
  newTodoTitle:string;
  setTitle:(arg: string) => void
};

export const HeaderInputForm: React.FC<Props> = ({
  handleSubmit,
  newTodoTitle,
  setTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={() => setTitle(newTodoField.current?.value || '')}
      />
    </form>
  );
};
