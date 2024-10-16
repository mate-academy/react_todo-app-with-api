import React, { RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  areTodosActive: boolean;
  handleFormSubmit: (event: React.FormEvent) => void;
  todoText: string;
  setTodoText: (todoText: string) => void;
  isSubmitting: boolean;
  inputRef: RefObject<HTMLInputElement>;
  handleToggleAll: () => Promise<void>;
  loadingTodos: number[];
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  areTodosActive,
  handleFormSubmit,
  todoText,
  setTodoText,
  isSubmitting,
  inputRef,
  handleToggleAll,
  loadingTodos,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {(loadingTodos[0] || hasTodos) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areTodosActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoText}
          onChange={event => setTodoText(event.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
