import React, { useEffect, useRef } from 'react';

type Props = {
  todoTitle: string;
  onSetTodoTitle: (title: string) => void;
  submitNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
};

export const NewTodo: React.FC<Props> = ({
  todoTitle,
  onSetTodoTitle: onGetTodoTitle,
  submitNewTodo,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <form onSubmit={submitNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={event => onGetTodoTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
