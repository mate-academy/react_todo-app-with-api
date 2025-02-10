import React from 'react';
import cn from 'classnames';

type Props = {
  onSetTitle: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onFocus: React.RefObject<HTMLInputElement>;
  inputTodo: boolean;
  onToggleAll: () => void;
  todosLength: boolean;
  checker: boolean;
};

export const Header: React.FC<Props> = ({
  onSetTitle,
  onSubmit,
  title,
  onFocus,
  inputTodo,
  onToggleAll,
  todosLength,
  checker,
}) => {
  return (
    <header className="todoapp__header">
      {!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: checker && !todosLength,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          value={title}
          ref={onFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => onSetTitle(e.target.value)}
          disabled={!inputTodo}
        />
      </form>
    </header>
  );
};
