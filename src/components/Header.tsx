/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>,
  title: string,
  setTitle: (event:string) => void,
  loading: boolean,
  todos: Todo[],
  allDone: boolean,
  toggleAllButton: () => void
};

export const Header: React.FC <Props> = ({
  handleSubmit,
  title,
  setTitle,
  loading,
  todos,
  allDone,
  toggleAllButton,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event).catch(() => {
      setTimeout(() => {
        titleField.current?.focus();
      }, 0);
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          onClick={toggleAllButton}
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: allDone })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={onSubmit}
      >
        <input
          disabled={loading}
          ref={titleField}
          onChange={handleTitleChange}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
