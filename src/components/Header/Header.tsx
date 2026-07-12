import classNames from 'classnames';
import React from 'react';

type Props = {
  title: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  hasTodos: boolean;
  isAllCompleted: boolean;
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  handleSubmit,
  setTitle,
  inputRef,
  isLoading,
  hasTodos,
  isAllCompleted,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
