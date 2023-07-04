import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodos: Todo[] | null
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
  newTodoTitle: string,
  setNewTodoTitle: (title: string) => void,
  toggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  activeTodos,
  handleSubmit,
  isLoading,
  newTodoTitle,
  setNewTodoTitle,
  toggleAll,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: activeTodos,
      })}
      aria-label="button"
      onClick={toggleAll}
    />

    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isLoading}
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
      />
    </form>
  </header>
);
