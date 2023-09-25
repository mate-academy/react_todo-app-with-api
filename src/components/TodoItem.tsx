import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  loadingId: number[],
  isLoaderActive: boolean,
  handleComplete: (arg: Todo) => void,
  handleEditTodo: (updatedTodo: Todo) => Promise<void>,
  handleDeleteTodo: (id: number) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingId,
  isLoaderActive,
  handleComplete,
  handleEditTodo,
  handleDeleteTodo,
}) => {
  const {
    id, completed, title, userId,
  } = todo;

  const [editedTitle, setEditedTitle] = useState(title);
  const [isUpdateFormActive, setIsUpdateFormActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isUpdateFormActive) {
      inputRef.current?.focus();
    }
  }, [isUpdateFormActive]);

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.detail === 2) {
      setIsUpdateFormActive(true);
    }
  };

  const submit = async () => {
    if (editedTitle.trim() !== '') {
      await handleEditTodo({
        id, title: editedTitle, userId, completed,
      });
    } else {
      await handleDeleteTodo(id);
    }

    setIsUpdateFormActive(false);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submit();
  };

  const handleOnBlur = () => {
    if (editedTitle !== title) {
      submit();
    } else {
      setIsUpdateFormActive(false);
    }
  };

  const handleCancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsUpdateFormActive(false);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={completed}
          onClick={() => handleComplete(todo)}
        />
      </label>

      {isUpdateFormActive ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            defaultValue={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={handleCancelEdit}
            disabled={isLoaderActive}
          />
        </form>
      ) : (
        <>
          <span className="todo__title" data-cy="TodoTitle">
            {title}
          </span>

          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingId.includes(id) && isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
