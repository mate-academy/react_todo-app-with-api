import React, { memo, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  handleNewTodoSubmit: (e: React.FormEvent) => void;
  newTodoTitle: string;
  handleNewTodoTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAddingTodo: boolean;
  inputRef: React.RefObject<HTMLInputElement>;

  todos: Todo[];
  handleToggleAll: () => void;
}
const HeaderComponent: React.FC<HeaderProps> = ({
  handleNewTodoSubmit,
  newTodoTitle,
  handleNewTodoTitleChange,
  isAddingTodo,
  inputRef,
  todos,
  handleToggleAll,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleNewTodoSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoTitleChange}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};

export const Header = memo(HeaderComponent); // Export memoized component
