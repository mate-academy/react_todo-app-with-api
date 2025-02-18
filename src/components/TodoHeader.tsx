import classNames from 'classnames';
import React, { useState } from 'react';
import { TodoErrors } from '../App';

interface HeaderProps {
  loading: boolean;
  isTitleDisabled: boolean;
  itemsLeft: number;
  onSubmit: (title: string) => Promise<void>;
  setErrorMessage: (message: TodoErrors) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  todosLength: number;
}

export const TodoHeader: React.FC<HeaderProps> = ({
  loading,
  isTitleDisabled,
  itemsLeft,
  onSubmit,
  setErrorMessage,
  inputRef,
  onToggleAll,
  todosLength,
}) => {
  const [title, setTitle] = useState('');

  // ! handler
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      setErrorMessage(TodoErrors.EmptyTitle);
    } else {
      onSubmit(title.trim()).then(() => setTitle(''));
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: itemsLeft === 0,
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
          disabled={isTitleDisabled || loading}
        />
      </form>
    </header>
  );
};
