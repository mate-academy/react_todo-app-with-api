import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  isLoading: boolean;
  allCompleted: boolean;
  focusTrigger: number;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  todosLoading: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  isLoading,
  allCompleted,
  focusTrigger,
  onTitleChange,
  onSubmit,
  onToggleAll,
  todosLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, focusTrigger]);

  return (
    <header className="todoapp__header">
      {!todosLoading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all${allCompleted ? ' active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
