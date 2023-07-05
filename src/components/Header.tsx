import React from 'react';

interface Props {
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  inputValue: string,
  setInputValue: (value: string) => void,
  todosLength: number,
  disableInput: boolean,
  handleToggleAll: () => void,
}

export const Header: React.FC<Props> = ({
  handleFormSubmit,
  inputValue,
  setInputValue,
  todosLength,
  disableInput,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">

      {(todosLength > 0) && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all "
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
