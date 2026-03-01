import React from 'react';
import classNames from 'classnames';

type Props = {
  activeTodo: boolean;
  title: string;
  setTitle: (value: string) => void;
  loading: boolean;
  onTodoAdd: (e: React.FormEvent) => void;
  focusedElement: React.RefObject<HTMLInputElement>;
  toggleAll?: () => void;
  hasTodos?: boolean;
};

export const Header: React.FC<Props> = ({
  activeTodo,
  title,
  setTitle,
  loading,
  onTodoAdd,
  focusedElement,
  toggleAll,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodo,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={onTodoAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
          ref={focusedElement}
        />
      </form>
    </header>
  );
};
