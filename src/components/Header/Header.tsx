/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  numberOfActive: number;
  isNoTodos: boolean;
  showError: (message: Errors) => void;
  onToogle: () => void;
  createTodo: (title: string) => void;
}

export const Header: React.FC<Props> = React.memo(
  ({
    numberOfActive,
    isNoTodos,
    showError,
    onToogle,
    createTodo,
  }) => {
    const [newTitle, setNewTitle] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const handleNewTodoSubmit = (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      setIsInputDisabled(true);
      const title = newTitle.trim();

      if (!title) {
        showError(Errors.EMPTY_TITLE);
        setNewTitle('');

        return;
      }

      createTodo(title);
      setIsInputDisabled(false);
      setNewTitle('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => (
      setNewTitle(event.target.value)
    );

    return (
      <header className="todoapp__header">
        <button
          aria-label="toogle_completed"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: Boolean(!numberOfActive),
            hidden: isNoTodos,
          })}
          onClick={onToogle}
        />

        <form onSubmit={handleNewTodoSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={handleInputChange}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
