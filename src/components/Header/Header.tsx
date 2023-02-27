import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  hasTodos: boolean,
  allCompleted: boolean,
  fetchNewTodo: (title: string) => void,
  isDisable: boolean,
  handleChangeStatus: () => void,
};

export const Header: React.FC<Props> = React.memo(({
  hasTodos,
  allCompleted,
  fetchNewTodo,
  isDisable,
  handleChangeStatus,
}) => {
  const [titleTodo, setTitleTodo] = useState('');

  const preparedTitleTodo = titleTodo.trim();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (hasTodos && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisable]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          aria-label="completed"
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: allCompleted,
            },
          )}
          onClick={handleChangeStatus}
        />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          fetchNewTodo(preparedTitleTodo);
          setTitleTodo('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={({ target }) => {
            setTitleTodo(target.value);
          }}
          disabled={isDisable}
          ref={inputRef}
        />
      </form>
    </header>
  );
});
