import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent) => void,
  loadingId: number[],
  title: string,
  onTitleChange: (title: string) => void,
  isLoaderActive: boolean,
  handleToggleAll: () => void,
  activeTodosCount: number
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  loadingId,
  title,
  onTitleChange,
  isLoaderActive,
  handleToggleAll,
  activeTodosCount,

}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="button"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosCount,
        })}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!loadingId.length || isLoaderActive}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
