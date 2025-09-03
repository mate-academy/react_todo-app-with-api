import React, { useEffect } from 'react';

import { Todo } from '../types/Todo';
import cn from 'classnames';
import { ErrorTypes } from '../types/ErrorType';
import { USER_ID } from '../api/todos';

type Props = {
  createTodoHandle: (value: Todo) => void;
  errorMessageHandle: (errorAnswer: ErrorTypes | null) => void;
  tempTodo: Todo | null;
  title: string;
  setTitle: (value: string) => void;

  titleField: React.RefObject<HTMLInputElement> | null;

  multiToggleHandle: () => void;
  isActive: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  createTodoHandle,
  errorMessageHandle,
  tempTodo,
  title,
  setTitle,
  titleField,

  multiToggleHandle,
  isActive,

  todos,
}) => {
  useEffect(() => {
    if (!tempTodo && titleField && titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, titleField]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      errorMessageHandle(ErrorTypes.titleError);

      return;
    }

    createTodoHandle({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActive,
          })}
          data-cy="ToggleAllButton"
          onClick={multiToggleHandle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={tempTodo !== null}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
