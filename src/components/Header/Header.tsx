import React, { memo } from 'react';
import cn from 'classnames';

interface Props {
  title: string,
  setTitle: (string: string) => void,
  isTodoAdding: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  toggleAllTodos: () => void;
  isAllTodosCompleted: boolean;
}

export const Header: React.FC<Props> = memo(({
  title,
  setTitle,
  isTodoAdding,
  newTodoField,
  handleSubmit,
  toggleAllTodos,
  isAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
