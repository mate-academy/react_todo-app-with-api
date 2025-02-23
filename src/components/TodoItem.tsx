import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as action from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  title: string;
  id: number;
  status?: boolean;
  userId: number;
  onError: (error: Error) => void;
  idsToDelete: number[] | null;
  resetIdsToDelete: (todoIds: number[]) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (todo: Todo) => Promise<void>;
  idsForStatusChange: number[];
}

export const TodoItem: React.FC<Props> = ({
  status = false,
  title,
  id,
  userId,
  onError,
  idsToDelete,
  resetIdsToDelete,
  handleDelete,
  handleUpdate,
  idsForStatusChange,
}) => {
  const [value, setValue] = useState(title);
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [editFormIsShown, setEditFormIsShown] = useState(false);
  const editInput = useRef<HTMLInputElement>(null);

  const deleteTodos = (todoId: number) => action.deleteTodo(todoId);

  const deleteTodo = () => {
    setDeletedTodoId(id);

    deleteTodos(id)
      .then(() => {
        handleDelete(id);
      })
      .catch(onError)
      .finally(() => setDeletedTodoId(0));
  };

  useEffect(() => {
    if (idsToDelete?.includes(id)) {
      deleteTodos(id)
        .then(() => {
          handleDelete(id);
          resetIdsToDelete(idsToDelete.filter(todoId => todoId !== id));
        })
        .catch(onError);
    }
  }, [idsToDelete]);

  const updateTodo = (newTitle?: string, newStatus = !status) => {
    setIsToggling(!isToggling);
    handleUpdate({
      id,
      title: newTitle || title,
      userId,
      completed: newStatus,
    })
      .then(() => setEditFormIsShown(false))
      .catch(() => {
        editInput.current?.focus();
      })
      .finally(() => setIsToggling(isToggling));
  };

  useEffect(() => {
    if (idsForStatusChange?.includes(id)) {
      updateTodo();
    }
  }, [idsForStatusChange]);

  const changeTitle = () => {
    const trimmedTitle = value.trim();

    setValue(trimmedTitle);

    if (!trimmedTitle) {
      deleteTodo();

      return;
    }

    if (trimmedTitle === title) {
      setEditFormIsShown(false);

      return;
    }

    updateTodo(trimmedTitle, status);
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      changeTitle();
    }
  };

  const onEscape: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Escape') {
      setValue(title);
      setEditFormIsShown(false);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed: status })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={value}
          checked={status}
          onChange={event => setValue(event.target.value)}
          onClick={() => updateTodo()}
          aria-label="Todo input field"
        />
      </label>

      {editFormIsShown ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInput}
            value={value}
            onKeyDown={onEnter}
            onKeyUp={onEscape}
            autoFocus
            onBlur={() => changeTitle()}
            onChange={event => setValue(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditFormIsShown(true)}
          >
            {value}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletedTodoId === id || idsToDelete?.includes(id) || isToggling,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
