import React, { useContext, useState } from 'react';
import { TodosContext } from '../TodosProvider';

export const AddTodoForm: React.FC = () => {
  const {
    handleFormSubmit,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const isFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleFormSubmit(query);
    setQuery('');
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
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
        onChange={handleInput}
      />
      <input type="submit" hidden />
    </form>
  );
};
