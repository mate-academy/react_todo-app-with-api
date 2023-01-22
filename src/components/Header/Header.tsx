import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent) => void,
  isAdding: boolean,
  setNewText: (state: string) => void,
  newText: string,
  toggleAllCompleted: () => void,
  isActiveAllBtn: boolean,
};

export const Header: React.FC<Props> = (
  {
    handleSubmit,
    isAdding,
    setNewText,
    newText,
    toggleAllCompleted,
    isActiveAllBtn,
  },
) => {
  const [isActiveToggleAll, setIsActiveToggleAll] = useState<boolean>(false);
  const handleText = (event: { target: { value: string } }) => {
    setNewText(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveAllBtn },
        )}
        aria-label="button-all-toggle"
        onClick={() => {
          toggleAllCompleted();
          setIsActiveToggleAll(!isActiveToggleAll);
        }}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newText}
          onChange={handleText}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
