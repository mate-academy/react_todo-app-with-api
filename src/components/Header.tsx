import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  isInputDisabled: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  isInputDisabled,
  onTitleChange,
  onSubmit,
  onToggleAll,
  inputRef,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={isInputDisabled}
          ref={inputRef}
          onChange={e => onTitleChange(e.target.value)}
        />
      </form>
    </header>
  );
};
