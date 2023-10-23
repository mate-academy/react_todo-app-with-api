/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

interface Props {
  todoTitle: string,
  onCreate: (newTitle: string) => void,
  createTodo: () => Promise<any>,
}

export const TodoForm: React.FC<Props> = ({
  todoTitle,
  onCreate,
  createTodo,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const titleReset = () => {
    onCreate('');
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsProcessing(true);
    createTodo().finally(() => setIsProcessing(false));

    titleReset();
  };

  return (
    <form
      action="./todos"
      method="POST"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isProcessing}
        value={todoTitle}
        onChange={(event) => onCreate(event.target.value)}
      />
    </form>
  );
};
