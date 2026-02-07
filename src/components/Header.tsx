import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
  allCompleted: boolean;
  todos: Todo[];
  handleToggleAllButton: (todos: Todo[]) => void;
  isLoadingTodos: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  handleTitleChange,
  handleSubmitForm,
  inputRef,
  disabled,
  allCompleted,
  todos,
  handleToggleAllButton,
  isLoadingTodos,
}) => {
  return (
    <header className="todoapp__header">
      {!isLoadingTodos && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          disabled={todos.length === 0}
          onClick={() => handleToggleAllButton(todos)}
        />
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
