import React, { memo, useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  onAddNewTodo: (event: React.FormEvent) => void;
  isAdded: boolean;
  onChangeAllTodos: () => void;
  isAllTodosCompleted: boolean;
};

export const TodosHeader: React.FC<Props> = memo(({
  newTodoTitle,
  setNewTodoTitle,
  onAddNewTodo,
  isAdded,
  onChangeAllTodos,
  isAllTodosCompleted,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdded]);

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
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAdded}
        />
      </form>
    </header>
  );
});
