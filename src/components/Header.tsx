/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[],
  isLoading: boolean,
  addTodo: (event: FormEvent<HTMLFormElement>) => void,
  toggleCompletedAll: () => void,
  newTitle: string,
  setNewTitle: (title: string) => void,
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  isLoading,
  addTodo,
  toggleCompletedAll,
  newTitle,
  setNewTitle,
}) => {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const allCompletedTodos = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompletedTodos,
        })}
        onClick={toggleCompletedAll}
      />

      <form
        onSubmit={addTodo}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
