/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
  newTitle: string;
  setNewTitle: (value: string) => void;
  isAdding: boolean;
  isAllCompleted: boolean;
  hasTodos: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleToggleAll: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  newTodoFieldRef,
  newTitle,
  setNewTitle,
  isAdding,
  isAllCompleted,
  hasTodos,
  handleSubmit,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
