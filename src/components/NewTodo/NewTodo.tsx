/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import cn from 'classnames';

interface Props {
  allTodosCompleted: boolean
  title: string
  setTitle: (newTitle: string) => void
  disabledInput: boolean
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  toggleAllStatuses: () => void
}

export const NewTodo: React.FC<Props> = React.memo(
  ({
    allTodosCompleted,
    title,
    setTitle,
    disabledInput,
    onFormSubmit,
    toggleAllStatuses,
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      return () => inputRef.current?.focus();
    }, [title]);

    return (
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: allTodosCompleted },
          )}
          onClick={toggleAllStatuses}
        />

        <form onSubmit={event => onFormSubmit(event)}>
          <input
            type="text"
            ref={inputRef}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabledInput}
          />
        </form>
      </header>
    );
  },
);
