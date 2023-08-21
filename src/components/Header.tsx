/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
  isTodoLoading: boolean,
  todosLength: number,
  numberCompletedTodos: number,
  onToggleAll: (completed: boolean, todos?: Todo[]) => void,
  allCompletedTodos: number,
};

export const Header: React.FC<Props> = ({
  onSubmit,
  todoTitle,
  setTodoTitle,
  isTodoLoading,
  todosLength,
  numberCompletedTodos,
  onToggleAll,
  allCompletedTodos,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const toggleTodosAll = () => {
    onToggleAll(!allCompletedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todosLength === numberCompletedTodos,
        })}
        onClick={toggleTodosAll}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
