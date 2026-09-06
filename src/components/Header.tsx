import React, { useEffect, useRef } from 'react';

type Props = {
  todos: { id: number; completed: boolean }[];
  allCompleted: boolean;
  newTodoTitle: string;
  isSubmitting: boolean;
  focusTrigger: number;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  allCompleted,
  newTodoTitle,
  isSubmitting,
  focusTrigger,
  onTitleChange,
  onSubmit,
  onToggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [isSubmitting, focusTrigger]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={newTodoTitle}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
