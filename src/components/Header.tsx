import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  hasAllTodosCompleted: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  handleToggleAll: () => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  hasAllTodosCompleted,
  handleAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  isSubmitting,
  handleToggleAll,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
