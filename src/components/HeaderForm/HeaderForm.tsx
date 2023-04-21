import React from 'react';

interface Props {
  disabledInput: boolean;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  handleQueryChange: (query: string) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const HeaderForm: React.FC<Props> = ({
  disabledInput,
  handleSubmitForm,
  handleQueryChange,
  query,
  setQuery,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    handleQueryChange(newQuery);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmitForm(event);
    setQuery('');
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
