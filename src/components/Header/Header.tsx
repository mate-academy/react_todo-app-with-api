import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (event: React.FormEvent) => void,
  todosLoading: number[],
  toggleCompleted: () => void;
  isActiveTodos: Todo[];
};

export const Header: React.FC<Props> = ({
  title,
  handleChange,
  handleSubmit,
  todosLoading,
  toggleCompleted,
  isActiveTodos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !!isActiveTodos.length,
        })}
        onClick={toggleCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={!!todosLoading.length}
        />
      </form>
    </header>
  );
};
