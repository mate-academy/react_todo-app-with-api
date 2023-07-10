import React from 'react';

interface Props {
  setIsError: (err: string | null) => void,
  setDisableInput: (value: boolean) => void,
  inputValue: string,
  addTodo: (title: string) => void,
  setInputValue: (value: string) => void,
  todosLength: number,
  disableInput: boolean,
  handleToggleAll: () => void,
}

export const Header: React.FC<Props> = ({
  setIsError,
  setDisableInput,
  addTodo,
  inputValue,
  setInputValue,
  todosLength,
  disableInput,
  handleToggleAll,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue || inputValue.trim().length === 0) {
      setIsError('Title can not be empty');

      return;
    }

    try {
      setDisableInput(true);
      await addTodo(inputValue);
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setDisableInput(false);
      setInputValue('');
    }
  };

  return (
    <header className="todoapp__header">

      {(todosLength > 0) && (
        <button
          type="button"
          aria-label="toogle"
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
          onChange={handleInputChange}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
