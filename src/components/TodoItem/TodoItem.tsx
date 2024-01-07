import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { IdsContext } from '../../utils/Context/IdsContext';

interface Props {
  todo: Todo
  onDelete: (id: number) => void;
  updateTitle: (id: number, title: string) => void,
  updateStatus: (id: number, status: boolean) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo, onDelete, updateTitle, updateStatus,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isDbCclicked, setIsDbClicked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const deletedIds = useContext(IdsContext);
  const { id, title, completed } = todo;

  const isLoading = deletedIds.includes(id);
  const deleteCurrentTodo = () => onDelete(id);
  const dbClickHandler = () => setIsDbClicked(true);

  const saveNewTitle = () => {
    setIsDbClicked(false);

    if (!newTitle) {
      deleteCurrentTodo();

      return;
    }

    if (newTitle === title) {
      return;
    }

    updateTitle(id, newTitle);
  };

  const blurHandler = () => saveNewTitle();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const escapeHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsDbClicked(false);
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveNewTitle();
  };

  useEffect(() => {
    if (isDbCclicked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDbCclicked]);

  return (
    <div
      className={classNames(
        'todo', { completed },
      )}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            updateStatus(id, !completed);
          }}
        />
      </label>
      {isDbCclicked ? (
        <form
          onSubmit={onSubmitHandler}
        >
          <input
            type="text"
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be removed"
            value={newTitle}
            onChange={onChangeHandler}
            onBlur={blurHandler}
            onKeyDown={escapeHandler}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={dbClickHandler}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={deleteCurrentTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
