/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';

type Props = {
  title: string;
  setTitle: (arg: string) => void;
  setIsHidden: (arg: boolean) => void;
  handleAdd: (event: React.KeyboardEvent) => void;
  completeAll: () => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = (
  {
    title,
    setTitle,
    setIsHidden,
    handleAdd,
    completeAll,
    isAdding,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={completeAll}
      />

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding === true}
          onChange={e => {
            setTitle(e.target.value);
            setIsHidden(true);
          }}
          onKeyUp={e => handleAdd(e)}
        />
      </form>
    </header>
  );
};
