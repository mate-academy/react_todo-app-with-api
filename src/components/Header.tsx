import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  handleChangeNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmptyLineError: (event: React.FormEvent) => void;
  errorMessage: string;
  tempTodo: Todo | null;
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  handleChangeNewTitle,
  handleEmptyLineError,
  errorMessage,
  tempTodo,
  toggleAllTodos,
}) => {
  const allChecked = todos.every(todo => todo.completed);
  const newTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoRef.current?.focus();
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allChecked,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleEmptyLineError}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChangeNewTitle}
          disabled={!!tempTodo}
          ref={newTodoRef}
        />
      </form>
    </header>
  );
};
