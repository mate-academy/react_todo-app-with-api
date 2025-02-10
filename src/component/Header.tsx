import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  handleSubmit: (event: React.FormEvent) => void;
  title: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  todos: Todo[];
  toggleAllTodos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  handleSubmit,
  title,
  handleTitleChange,
  isLoading,
  inputRef,
  toggleAllTodos,
  todos,
}) => {
  const allCompleted = todos.every(todo => todo.completed);
  // const showButton = isLoading && todos.length > 0;

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo focused"
          placeholder="What needs to de done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
