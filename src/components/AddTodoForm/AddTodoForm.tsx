import React, { useContext } from 'react';
import { TodosContext } from '../TodosProvider';

export const AddTodoForm: React.FC = () => {
  const {
    query,
    handleInput,
    handleFormSubmit,
  } = useContext(TodosContext);
  const isFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleFormSubmit();
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInput(event.target.value);
  };

  return (
    <form
      onSubmit={(event) => {
        isFormSubmit(event);
      }}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={handleQuery}
      />
      <input type="submit" hidden />
    </form>
  );
};
