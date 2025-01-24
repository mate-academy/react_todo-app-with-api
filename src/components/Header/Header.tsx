import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  isVisibileBtn: boolean;
  isAllCompletedTodo: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  setErrorMessage: (value: ErrorType) => void;
  onSubmit: (value: Todo) => Promise<void>;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  isVisibileBtn,
  isAllCompletedTodo,
  inputRef,
  isLoading,
  setErrorMessage,
  onSubmit,
  toggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [inputRef, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage(ErrorType.ERROR_TITLE);

      return;
    }

    onSubmit({
      id: 0,
      title: todoTitle.trim(),
      userId: USER_ID,
      completed: false,
    }).then(() => setTodoTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {isVisibileBtn && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompletedTodo,
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
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
