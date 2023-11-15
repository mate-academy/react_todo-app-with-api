import React, { useCallback, useContext } from 'react';
import { TodosContext } from '../../TodosContext';

export const NewTodo: React.FC = () => {
  const {
    addTodo,
    setTitle,
    title,
    statusResponce,
  } = useContext(TodosContext);

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
        disabled={statusResponce}
      />
    </form>
  );
};
