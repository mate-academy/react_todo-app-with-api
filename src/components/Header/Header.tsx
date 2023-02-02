import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAddNewTodo: (event: React.FormEvent) => void;
  isAdding: boolean;
  onChangeAllTodos: () => void;
  isAllTodosCompleted: boolean;
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  newTitle,
  setNewTitle,
  onAddNewTodo,
  isAdding,
  onChangeAllTodos,
  isAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={onChangeAllTodos}
      />

      <form onSubmit={onAddNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
