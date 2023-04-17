import React, { useState } from 'react';

interface Props {
  disabledInput: boolean;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  handleQueryChange: (query: string) => void;
}

export const HeaderForm: React.FC<Props> = ({
  disabledInput, handleSubmitForm, handleQueryChange,
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    handleQueryChange(newQuery);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmitForm(event);
    setQuery(''); // This clears the input field
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={disabledInput}
        onChange={handleInputChange}
        value={query}
      />
    </form>
  );
};
