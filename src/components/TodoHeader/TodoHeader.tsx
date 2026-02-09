/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allCompleted: boolean;
  isLoading: boolean;
  newTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  hasTodos,
  allCompleted,
  isLoading,
  newTitle,
  inputRef,
  onTitleChange,
  onAddTodo,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => onTitleChange(event.target.value)}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
