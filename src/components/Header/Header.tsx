import React, { LegacyRef } from 'react';
import classNames from 'classnames';

type Props = {
  isTodos: boolean;
  isAllTodoCompleted: boolean;
  onChangeAllCompletedStatus: () => Promise<void>;
  handelSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  onChangeNewTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingAddTodo: boolean;
  formInputRef: LegacyRef<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  isTodos,
  isAllTodoCompleted,
  onChangeAllCompletedStatus,
  handelSubmit,
  newTodoTitle,
  onChangeNewTodoTitle,
  isLoadingAddTodo,
  formInputRef,
}) => {
  return (
    <header className="todoapp__header">
      {isTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onChangeAllCompletedStatus}
          aria-label="Toggle All Button"
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
          ref={formInputRef}
        />
      </form>
    </header>
  );
};
