import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onAddTodo: (e: React.FormEvent) => void;
  activeTodosCount: number;
  todosLength: number;
  tempTodo: Todo | null;
  titleField: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onAddTodo,
  activeTodosCount,
  todosLength,
  tempTodo,
  titleField,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
