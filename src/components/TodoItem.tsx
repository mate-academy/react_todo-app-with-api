import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../utils/ErrorMessages';

type Props = {
  todo: Todo,
  updateTodo?: (arg: Todo) => Promise<Todo | void>,
  loadingId?: number[],
  setLoadingId?: (arg: number[] | []) => void,
  handleDeleteTodo?: (id: number) => Promise<void>,
  setErrorMessage?: (error: ErrorMessages) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo = () => {},
  loadingId = [0],
  setLoadingId = () => {},
  handleDeleteTodo = () => {},
  setErrorMessage = () => {},
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

  const handleComplete = (updatedTodo: Todo) => {
    setErrorMessage(ErrorMessages.NoError);
    setLoadingId([updatedTodo.id]);

    const foundTodo = { ...updatedTodo };

    foundTodo.completed = !foundTodo.completed;

    updateTodo(foundTodo);
  };

  const handleEditTodo = (updatedTodo: Todo) => {
    setLoadingId([updatedTodo.id]);

    return updateTodo(updatedTodo);
  };

  const submit = async () => {
    if (editedTitle.trim()) {
      try {
        await handleEditTodo({
          id, title: editedTitle, userId, completed,
        });
      } catch {
        setErrorMessage(ErrorMessages.UpdateError);
        throw new Error(ErrorMessages.UpdateError);
      }
    } else {
      try {
        await handleDeleteTodo(id);
      } catch {
        setErrorMessage(ErrorMessages.DeleteError);
        throw new Error(ErrorMessages.DeleteError);
      }
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
    <div
      data-cy="Todo"
      aria-hidden="true"
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
            disabled={!!loadingId.length}
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
          'is-active': loadingId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
