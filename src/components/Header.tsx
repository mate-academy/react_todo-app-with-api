/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { ChangeEvent, FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string,
  addNewTodoTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  createNewTodo: (event: FormEvent<HTMLFormElement>) => void,
  activeTodos: Todo[],
  isNewTodoLoading: boolean,
  toggleAllTodoStatus: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  addNewTodoTitle,
  createNewTodo,
  activeTodos,
  isNewTodoLoading,
  toggleAllTodoStatus,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: activeTodos.length === 0 },
        )}
        onClick={toggleAllTodoStatus}
      />
      <form onSubmit={createNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={addNewTodoTitle}
          disabled={isNewTodoLoading}
        />
      </form>
    </header>
  );
};
