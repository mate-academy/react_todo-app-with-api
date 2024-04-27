import classNames from 'classnames';
import React from 'react';

type Props = {
  isAllCompleted: boolean;
  handleToggleAll: () => void;
  handleSubmit: (event: React.KeyboardEvent<HTMLFormElement>) => void;
  inputValue: string;
  setInputValue: (prop: string) => void;
};

const Header: React.FC<Props> = ({
  isAllCompleted,
  handleSubmit,
  handleToggleAll,
  inputValue,
  setInputValue,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onKeyDown={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
