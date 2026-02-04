import React, { RefObject } from 'react';
import cn from 'classnames';
import { Todo } from '../../type/Todo';

type Props = {
  hasTodos: Todo[];
  activeTodo: boolean;
  title: string;
  setTitle: (newTitle: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onToggleAll?: () => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  activeTodo,
  title,
  setTitle,
  onSubmit,
  loading,
  inputRef,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodo,
          })}
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
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
