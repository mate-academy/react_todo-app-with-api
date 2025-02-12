import classNames from 'classnames';
import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[] | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleSubmit: (event: FormEvent) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
  toggleAll: () => void;
  allTodos: Todo[] | null;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  handleSubmit,
  title,
  setTitle,
  disabled,
  toggleAll,
  allTodos,
}) => {
  const areAllCompleted = todos?.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {allTodos && allTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={event => setTitle(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
