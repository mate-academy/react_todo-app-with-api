/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { Todo } from '../types/Todo';

type Props = {
  amountTodos: number;
  userId: number;
  setErrorMessage: (error: ErrorMessages) => void;
  onSubmit: ({
    id, title, completed, userId,
  }: Todo)=> Promise<void>;
  amountActive: number;
  handleToggleTodosAll: () => void;
};

export const Header: React.FC<Props> = ({
  amountTodos, userId, setErrorMessage,
  onSubmit, amountActive, handleToggleTodosAll,
}) => {
  const [title, setTitle] = useState('');
  const [isCreat, setIsCreat] = useState(false);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage(ErrorMessages.EMPTY);
  };

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TITLE);

      return;
    }

    setIsCreat(true);

    onSubmit({
      id: 0,
      title,
      completed: false,
      userId,
    })
      .then(reset)
      .finally(() => setIsCreat(false));
  };

  return (
    <header className="todoapp__header">
      {amountTodos !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: amountActive === 0,
          })}
          onClick={handleToggleTodosAll}
        />
      )}
      <form
        method="POST"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-loading': isCreat,
          })}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isCreat}
        />
      </form>
    </header>
  );
};
