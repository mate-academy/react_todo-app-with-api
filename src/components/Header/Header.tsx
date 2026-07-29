import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  isEveryCompleted: boolean;
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  isEveryCompleted,
  title,
  setTitle,
  isSubmitting,
  onSubmit,
  inputRef,
  toggleAll,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
