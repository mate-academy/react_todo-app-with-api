import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

interface HeaderProps {
  onAddTodo: (title: string) => void;
  onMarkAllAsCompleted: (completed: boolean) => void;
  areAllCompleted: boolean;
  shouldShowMarkAllButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAddTodo,
  onMarkAllAsCompleted,
  areAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onAddTodo('');
      return;
    }

    onAddTodo(trimmedTitle);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllCompleted,
        })}
        onClick={() => onMarkAllAsCompleted(!areAllCompleted)}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="What needs to be done?"
          className="todoapp__new-todo"
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
        />
      </form>
    </header>
  );
};
