/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  allTodosCompleted: boolean,
  disableInput: boolean,
  titleTodo: string,
  setTitleTodo: React.Dispatch<React.SetStateAction<string>>,
  addHandler: () => void,
  onToggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  allTodosCompleted,
  disableInput,
  titleTodo,
  setTitleTodo,
  addHandler,
  onToggleAll,
}) => {
  const submitNewTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addHandler();
  };

  const titleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disableInput) {
      setTitleTodo(event.target.value);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: allTodosCompleted },
        )}
        onClick={onToggleAll}
      />

      <form
        onSubmit={submitNewTitle}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={titleInput}
        />
      </form>
    </header>
  );
};
