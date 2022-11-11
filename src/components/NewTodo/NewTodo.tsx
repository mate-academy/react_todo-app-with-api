/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorNoticeType } from '../../types/ErrorNoticeType';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAdding: boolean,
  isToggleVisible: boolean,
  isAllTodosCompleted: boolean,
  setHasError: (status: boolean) => void,
  setErrorNotice: (notice: ErrorNoticeType) => void,
  postTodoToServer: (title: string) => void,
  toggleAllTodosStatus: () => void,
}

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  isAdding,
  isToggleVisible,
  isAllTodosCompleted,
  setHasError,
  setErrorNotice,
  postTodoToServer,
  toggleAllTodosStatus,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newTitle.trim()) {
        setHasError(true);
        setErrorNotice(ErrorNoticeType.TitleError);

        return;
      }

      postTodoToServer(newTitle);
    }, [newTitle],
  );

  useEffect(() => {
    if (!isAdding) {
      setNewTitle('');
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {isToggleVisible && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          onClick={toggleAllTodosStatus}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => {
            setNewTitle(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
