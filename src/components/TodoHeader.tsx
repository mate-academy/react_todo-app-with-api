import React, { RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  newTitle: string;
  inputRef: RefObject<HTMLInputElement>;
  inputDisabled: boolean;
  onToggleAll: () => void;
  onChangeTitle: (value: string) => void;
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todosLength,
  allCompleted,
  newTitle,
  inputRef,
  inputDisabled,
  onToggleAll,
  onChangeTitle,
  onAdd,
}) => (
  <header className="todoapp__header">
    {todosLength > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}
    <form onSubmit={onAdd}>
      <input
        ref={inputRef}
        value={newTitle}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={e => onChangeTitle(e.target.value)}
        disabled={inputDisabled}
      />
    </form>
  </header>
);
