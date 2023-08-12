/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  hasActiveTodos: boolean,
  onTitleChange: (newTitle: string) => void,
  isInputDisabled: boolean,
  onAddTodo: (title: string) => void,
  todos: Todo[],
  handleUpdateAllTodosStatus: () => void,
};

export const Header: React.FC<Props> = ({
  title,
  hasActiveTodos,
  onTitleChange,
  isInputDisabled,
  onAddTodo,
  todos,
  handleUpdateAllTodosStatus,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    onAddTodo(trimmedTitle);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !hasActiveTodos },
          )}
          onClick={handleUpdateAllTodosStatus}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
