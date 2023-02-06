import React, { memo, useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  newTitle: string;
  setNewTitle: (title: string) => void;
  addNewTodo: (event: React.FormEvent) => void;
  isAdding: boolean;
  changeAllTodos: () => void;
  isAllTodosCompleted: boolean;
};

export const Header: React.FC<Props> = memo(({
  newTitle,
  setNewTitle,
  addNewTodo,
  isAdding,
  changeAllTodos,
  isAllTodosCompleted,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

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
        onClick={changeAllTodos}
      />

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
