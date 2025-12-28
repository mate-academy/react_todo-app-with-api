import React from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  allCompleted: boolean;
  title: string;
  setTitle: (title: string) => void;
  onAddTodo: (e: React.FormEvent) => void;
  loading: boolean;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onToggleAll: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  allCompleted,
  title,
  setTitle,
  onAddTodo,
  loading,
  onToggleAll,
  inputRef,
}) => (
  <header className="todoapp__header">
    <h1 className="todoapp__title">todos</h1>

    <form onSubmit={onAddTodo} style={{ position: 'relative' }}>
      {/* Кнопка Toggle All показується тільки коли є todos і не йде завантаження */}
      {!loading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={onToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
      />
    </form>
  </header>
);
