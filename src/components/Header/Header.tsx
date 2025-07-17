import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  setTitle: (val: string) => void;
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  setTitle,
  title,
  handleSubmit,
  loading,
  toggleAll,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && !loading && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />
    )}

    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        ref={inputRef}
        disabled={loading}
      />
    </form>
  </header>
);
