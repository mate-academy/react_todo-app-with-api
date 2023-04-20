/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  unfinishedTodos: Todo[];
  isDisabledInput: boolean;
  onTodoCreation: (title:string) => void;
  onAllTodoCompletion: () => void,
};

export const Header: React.FC<Props> = ({
  unfinishedTodos,
  isDisabledInput,
  onTodoCreation,
  onAllTodoCompletion,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTodoCreation(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          classNames(
            'todoapp__toggle-all',
            { active: unfinishedTodos.length },
          )
        }
        onClick={onAllTodoCompletion}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabledInput}
          value={todoTitle}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
