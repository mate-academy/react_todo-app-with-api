import React, { useState } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  isActiveToogle: boolean;
  isHiddenToogle: boolean;
  showError: (message: ErrorType) => void;
  onToogle: () => void;
  createTodo: (title: string) => void;
}

export const Header: React.FC<Props> = React.memo(
  ({
    isActiveToogle,
    isHiddenToogle,
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
        showError(ErrorType.EMPTY_TITLE);
        setNewTitle('');
        setIsInputDisabled(false);

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
            active: isActiveToogle,
            'hidden-button': isHiddenToogle,
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
