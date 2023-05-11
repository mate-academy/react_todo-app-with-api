/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string,
  setNewTodoTitle: (title: string) => void,
  addTodo: (event: FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
  toggleAllcompletedTodos: () => void,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
  isLoading,
  toggleAllcompletedTodos,
  todos,
}) => {
  const handleAddTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const allCompletedTodos = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompletedTodos,
        })}
        onClick={toggleAllcompletedTodos}
      />

      <form
        onSubmit={addTodo}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleAddTitle}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
