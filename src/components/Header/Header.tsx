import React from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  newTitle: string;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosLength,
  allCompleted,
  newTitle,
  isAdding,
  inputRef,
  onAdd,
  onTitleChange,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          disabled={isAdding}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
