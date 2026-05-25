import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
  areAllCompleted: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  isAdding,
  onToggleAll,
  hasTodos,
  areAllCompleted,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={titleField}
        />
      </form>
    </header>
  );
};
