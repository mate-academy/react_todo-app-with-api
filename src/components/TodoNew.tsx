import React, { useCallback } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  addTodo: () => void;
  statusResponse: boolean;
};

export const TodoNew: React.FC<Props> = ({
  title,
  setTitle,
  addTodo,
  statusResponse,
}) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addTodo();
    },
    [addTodo],
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        ref={input => input && input.focus()}
        disabled={statusResponse}
      />
    </form>
  );
};
