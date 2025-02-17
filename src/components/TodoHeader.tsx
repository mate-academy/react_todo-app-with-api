// import { event } from 'cypress/types/jquery';
import classNames from 'classnames';
import React, { useState } from 'react';

interface HeaderProps {
  loading: boolean;
  isInputDisabled: boolean;
  todosLeft: number;
  onSubmit: (title: string) => Promise<void>;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  todosLength: number;
}

export const TodoHeader: React.FC<HeaderProps> = ({
  loading,
  isInputDisabled,
  todosLeft,
  onSubmit,
  setErrorMessage,
  inputRef,
  onToggleAll,
  todosLength,
}) => {
  const [title, setTitle] = useState('');

  // #region reset
  const reset = () => {
    setTitle('');
  };
  // #endregion

  // #region handler
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');
    } else {
      onSubmit(title.trim()).then(reset);
    }
  };
  // #endregion

  const toggleAllVisible = todosLength > 0;

  return (
    <header className="todoapp__header">
      {toggleAllVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todosLeft === 0,
          })}
          data-cy="ToggleAllButton"
          disabled={loading}
          onClick={onToggleAll}
        />
      )}

      <form method="POST" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={loading || isInputDisabled}
        />
      </form>
    </header>
  );
};
