import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Emessage } from './types/Emessage';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  submitHandler: (inputText: string) => Promise<void>;
  inputDisabled: boolean;
  todosLength: number;
  completedTodosLength: number;
  toggleAll: () => void;
  handleErrMessage: (message: Emessage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  submitHandler,
  inputDisabled,
  todosLength,
  completedTodosLength,
  toggleAll,
  handleErrMessage,
}) => {
  const [localInputText, setLocalInputText] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!localInputText.trim()) {
      handleErrMessage(Emessage.title);

      return;
    }

    submitHandler(localInputText)
      .then(() => {
        setLocalInputText('');
      })
      .catch(() => {
        handleErrMessage(Emessage.add);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodosLength === todosLength,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={localInputText}
          onChange={e => setLocalInputText(e.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
