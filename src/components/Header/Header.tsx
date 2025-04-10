import React, { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: (
    event: React.FormEvent,
    focusInput: () => void,
  ) => Promise<void>;
  isLoading: boolean;
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => Promise<void>;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  isLoading,
  todos,
  inputRef,
  toggleAll,
}) => {
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isLoading, todos.length, inputRef]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleAddTodo(event, focusInput)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
