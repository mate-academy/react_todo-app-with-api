import React from 'react';
import { Todo } from '../types/Types';
import classNames from 'classnames';

type HeaderInputProps = {
  addNewTodo: (title: string) => void;
  title: string;
  setTitle: (value: string) => void;
  disabled: boolean;
  toggleAll: () => void;
  todos: Todo[];
};

export const HeaderInput = ({
  addNewTodo,
  title,
  setTitle,
  disabled,
  toggleAll,
  todos,
}: HeaderInputProps) => {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodo(title);
  };

  const areAllDone = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: areAllDone })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={submitForm}>
        <input
          disabled={disabled}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
