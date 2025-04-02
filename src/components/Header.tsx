import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  handleUpdateStatusAll: () => void;
  isAllCompleted: boolean;
  isTodosNotEmpty: boolean;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleAddTodo,
  handleUpdateStatusAll,
  isAllCompleted,
  isTodosNotEmpty,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef?.current?.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {isTodosNotEmpty && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            // eslint-disable-next-line prettier/prettier
            'active': isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleUpdateStatusAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
