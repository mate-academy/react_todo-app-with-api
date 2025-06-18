import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

interface Props {
  isAllTodoCompleted: boolean;
  isLoading: boolean;
  hasTodo: boolean;
  toggleAll: () => void;
  addTodo: (title: string) => Promise<boolean>;
}

export const AppHeader: React.FC<Props> = ({
  isAllTodoCompleted,
  isLoading,
  hasTodo,
  toggleAll,
  addTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isSuccessed = await addTodo(todoTitle);

    if (isSuccessed) {
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodo && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={cn('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
