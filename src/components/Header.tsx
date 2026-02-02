import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  isAllCompleted: boolean;
  title: string;
  setTitle: (value: string) => void;
  onAddTodo: (event: React.FormEvent) => void;
  isAdding: boolean;
  todoInputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  isAllCompleted,
  title,
  setTitle,
  onAddTodo,
  isAdding,
  todoInputRef,
  onToggleAll,
}) => {
  useEffect(() => {
    if (!isAdding) {
      todoInputRef.current?.focus();
    }
  }, [isAdding, todoInputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
