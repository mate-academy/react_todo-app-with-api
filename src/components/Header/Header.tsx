import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAddingTodo: boolean,
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  title: string,
  setTitle: (title: string) => void,
  changeAllTodos: () => void,
  isAllTodosCompleted: boolean
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  isAddingTodo,
  onAddTodo,
  title,
  setTitle,
  changeAllTodos,
  isAllTodosCompleted,
}) => {
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await onAddTodo(event);

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        onClick={changeAllTodos}
      />

      <form
        onSubmit={event => handleFormSubmit(event)}
      >
        <input
          disabled={isAddingTodo}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
