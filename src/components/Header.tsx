import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  todos: Todo[];
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  onCreateTodo: (title: string) => void;
  onToggleAll: () => void;
  inputDisabled: boolean;
  isCreating: boolean;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  todoTitle,
  setTodoTitle,
  onCreateTodo,
  onToggleAll,
  inputDisabled,
  isCreating,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isCreating) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isCreating]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(t => t.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          if (isCreating) {
            return;
          }

          onCreateTodo(todoTitle);
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
