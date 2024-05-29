import React, { useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  tempTodo: Todo | null;
  isDisabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  titleText: string;
  onType: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAllTodos: () => void;
}

export const Header: React.FC<Props> = ({
  inputRef,
  todos,
  tempTodo,
  isDisabled,
  onSubmit,
  titleText,
  onType,
  toggleAllTodos,
}) => {
  const areAllTodosCompleted: boolean = todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isDisabled}
          ref={inputRef}
          value={titleText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onType}
        />
      </form>
    </header>
  );
};
