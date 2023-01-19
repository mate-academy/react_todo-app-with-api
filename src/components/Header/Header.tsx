/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (arg: string) => void;
  setHidden: (arg: boolean) => void;
  handleAdd: () => void;
  completeAll: () => void;
  adding: boolean;
  completedTodosCount: number,
  todosCount: number,
};

export const Header: React.FC<Props> = (
  {
    title,
    setTitle,
    setHidden,
    handleAdd,
    completeAll,
    adding,
    completedTodosCount,
    todosCount,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todosCount !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: completedTodosCount > 0,
            },
          )}
          onClick={completeAll}
        />
      )}

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={adding === true}
          onChange={e => {
            setTitle(e.target.value);
            setHidden(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
      </form>
    </header>
  );
};
