/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';

type Props = {
  query: string,
  setQuery: (value: string) => void,
  createNewTodo: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const TodoForm: React.FC<Props> = ({
  query,
  setQuery,
  createNewTodo,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={createNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
};
