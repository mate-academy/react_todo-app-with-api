import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  onCreateTodo: (value: string) => Promise<void>;
  onToggleTodos: (completed: boolean) => void;
  todosCountInfo: number[]; // [allTodosCount, activeTodosCount]
};

export const Header = forwardRef<HTMLInputElement, Props>(function Header(
  {
    todosCountInfo: [allTodosCount, activeTodosCount],
    onCreateTodo,
    onToggleTodos,
  },
  ref,
) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAllCompleted = allTodosCount > 0 && activeTodosCount === 0;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    onCreateTodo(title)
      .then(() => setTitle(''))
      .catch(() => {
        // keep title on error
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // optional: keep focus after submit
  useEffect(() => {
    if (!isSubmitting && ref && 'current' in ref) {
      ref.current?.focus();
    }
  }, [isSubmitting, ref]);

  return (
    <header className="todoapp__header">
      {allTodosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleTodos(!isAllCompleted)}
          disabled={isSubmitting}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          value={title}
          onChange={handleTitleChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
});
