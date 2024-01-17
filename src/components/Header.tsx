import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isDisable: boolean;
  onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
  handleAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  isDisable,
  onHandleSubmit,
  title,
  setTitle,
  handleAllCompleted,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisable, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={handleAllCompleted}
        />
      )}
      <form
        action="/"
        method="POST"
        onSubmit={onHandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isDisable}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
