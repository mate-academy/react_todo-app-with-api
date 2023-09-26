/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onTodoTitleChange: (title: string) => void;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isTodoAdding: boolean;
  activeTodosCounter: number;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  todoTitle,
  onTodoTitleChange,
  onFormSubmit,
  isTodoAdding,
  activeTodosCounter,
  onToggleAll,
}) => {
  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current?.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodosCounter,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll()}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => onTodoTitleChange(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
};
