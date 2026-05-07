import React from 'react';
import classNames from 'classnames';

type Props = {
  allCompleted: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  title: string;
  setTitle: (value: string) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  hasTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  allCompleted,
  handleSubmit,
  title,
  setTitle,
  isAdding,
  inputRef,
  handleToggleAll,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
