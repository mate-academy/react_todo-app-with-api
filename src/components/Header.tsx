import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface HeaderProps {
  onAddTodo: (title: string, completed: boolean) => Promise<Todo | undefined>;
  onToggleAll: () => void;
  areAllCompleted: boolean;
  todosCount: number;
  isDeletingTodo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAddTodo,
  onToggleAll,
  areAllCompleted,
  todosCount,
  isDeletingTodo,
 }) => {
  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isDeletingTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const newTodo = await onAddTodo(title, completed);

      if (newTodo) {
        setTitle('');
        setCompleted(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={cn('todoapp__toggle-all', {
            checked: areAllCompleted,
            active: areAllCompleted,
          })}
          onClick={onToggleAll}
        >
        </button>
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '' : ''}
        </button>
      </form>
    </header>
  );
};
