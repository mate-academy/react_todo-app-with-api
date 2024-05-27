import React, { useEffect, useRef } from 'react';

import { Todo } from '../../types/Todo';

interface Props {
  onToDoSave: (title: string) => Promise<void> | undefined;
  onTitleChange: (title: string) => void;
  initialTitle: string;
  isLoading: boolean;
  todos: Todo[];
  onUpdate: (id: number, updatedTodo: Partial<Todo>) => Promise<void>;
  setIsAllLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<Props> = ({
  onToDoSave,
  onTitleChange,
  initialTitle,
  isLoading,
  todos,
  onUpdate,
  setIsAllLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onToDoSave(initialTitle);
  };

  const handleToggleAll = () => {
    setIsAllLoading(true);
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const promises: Promise<void>[] = [];

    todos.forEach(todo => {
      if (todo.completed === newStatus) {
        return;
      }

      promises.push(onUpdate(todo.id, { completed: newStatus }));
    });
    Promise.all(promises).finally(() => setIsAllLoading(false));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isLoading}
          placeholder="What needs to be done?"
          ref={inputRef}
          value={initialTitle}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
