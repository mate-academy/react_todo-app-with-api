import classNames from 'classnames';
import React from 'react';

interface Props {
  isThereActiveTodo: boolean,
  inputValue: string,
  apiResponseReceived: boolean,
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  updateTempTodo: (value: string) => void,
  updateAllTodo: () => Promise<void>,
}

export const Header: React.FC<Props> = ({
  isThereActiveTodo,
  inputValue,
  handleFormSubmit,
  updateTempTodo,
  apiResponseReceived,
  updateAllTodo,
}) => {
  return (
    <header className="todoapp__header">
      <label htmlFor="nameInput">
        <button
          id="nameInput"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isThereActiveTodo,
          })}
          onClick={updateAllTodo}
        >
          {null}
        </button>
      </label>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => {
            updateTempTodo(event.target.value);
          }}
          disabled={apiResponseReceived}
        />
      </form>
    </header>
  );
};
