import classNames from 'classnames';
import React from 'react';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  titleField: React.RefObject<HTMLInputElement>;
  toggleAllTodosHandler: () => void;
  allCompletedTodos: boolean;
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  loading,
  onSubmit,
  titleField,
  toggleAllTodosHandler,
  allCompletedTodos,
}) => {
  const inputValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompletedTodos,
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodosHandler}
      />

      <form onSubmit={onSubmit}>
        <input
          ref={titleField}
          value={inputValue}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={inputValueHandler}
        />
      </form>
    </header>
  );
};
