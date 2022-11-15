import React, { useEffect, useRef } from 'react';

type Props = {
  addTodo: (event: React.FormEvent) => Promise<void>;
  isAdding: boolean;
  newTodoTitle: string;
  onInput: (input: string) => void;
};

export const NewTodoField: React.FC<Props> = ({
  addTodo,
  isAdding,
  newTodoTitle,
  onInput,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [newTodoTitle]);

  return (
    <form
      onSubmit={addTodo}
    >
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={newTodoTitle}
        onChange={(event) => onInput(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
