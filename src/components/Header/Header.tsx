import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (title: string) => void;
  title: string;
  setTitle: (value: string) => void;
  todos: Todo[];
  errorMessage: string;
  isLoading: boolean;
  toggleAllTodosStatus: (todos: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  title,
  setTitle,
  todos,
  errorMessage,
  isLoading,
  toggleAllTodosStatus: toggleAllTodosStatus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, errorMessage, todos]);

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(title);
  };

  const areAllCompleted = todos.every((todo: Todo) => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAllTodosStatus(todos)}
        />
      )}

      <form onSubmit={handleTitleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
