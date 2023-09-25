/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { LegacyRef } from 'react';
import classNames from 'classnames';

type Props = {
  isTodos: boolean;
  isCompletedAll: boolean;
  onChangeAllCompletedStatus: () => Promise<void>;
  handelSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  onChangeNewTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingAddTodo: boolean;
  formInput: LegacyRef<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  isTodos,
  isCompletedAll,
  onChangeAllCompletedStatus,
  handelSubmit,
  newTodoTitle,
  onChangeNewTodoTitle,
  isLoadingAddTodo,
  formInput,
}) => {
  return (
    <header className="todoapp__header">
      {isTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isCompletedAll,
          })}
          data-cy="ToggleAllButton"
          onClick={onChangeAllCompletedStatus}
        />
      )}

      <form onSubmit={handelSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onChangeNewTodoTitle}
          disabled={isLoadingAddTodo}
          ref={formInput}
        />
      </form>
    </header>
  );
};
