/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateReasons } from '../../types/UpdateReasons';
import { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  isNewTodoAdding?: boolean;
  loadingTodo?: Todo;
  todoIdsForRemoving: number[] | null;
  isTodoDeleting?: boolean;
  setTodoIdsForRemoving?: (id: number[] | null) => void;
  setIsTodoDeleting?: (isTodoDeleting: boolean) => void;
  idsForUpdate: number[];
  setIdsForUpdate: (idsForUpdate: number[]) => void;
  setReasonForUpdate: (reason: UpdateReasons | null) => void;
  setTypeOfStatusChange: (statusChanging: boolean | null) => void;
  setTitleForUpdate: (title: string) => void;
  titleSuccess: boolean | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isNewTodoAdding,
  todoIdsForRemoving,
  isTodoDeleting,
  setTodoIdsForRemoving,
  setIsTodoDeleting,
  idsForUpdate,
  setReasonForUpdate,
  setIdsForUpdate,
  setTypeOfStatusChange,
  setTitleForUpdate,
  titleSuccess,
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);

  const onDelete = () => {
    if (setTodoIdsForRemoving && setIsTodoDeleting) {
      setTodoIdsForRemoving(
        todoIdsForRemoving ? [...todoIdsForRemoving!, id] : [id],
      );
      setIsTodoDeleting(true);
    }
  };

  const onStatusChange = () => {
    setReasonForUpdate(UpdateReasons.oneToggled);
    setIdsForUpdate(idsForUpdate ? [...idsForUpdate, id] : [id]);

    if (completed) {
      setTypeOfStatusChange(false);
    } else {
      setTypeOfStatusChange(true);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (setTodoIdsForRemoving && setIsTodoDeleting) {
      setTodoIdsForRemoving(
        todoIdsForRemoving ? [...todoIdsForRemoving!, id] : [id],
      );
      setIsTodoDeleting(true);
    }
  };

  const handleUpdate = () => {
    setReasonForUpdate(UpdateReasons.titleChanged);
    setTitleForUpdate(editedTitle.trim());
    setIdsForUpdate(idsForUpdate ? [...idsForUpdate, id] : [id]);
  };

  useEffect(() => {
    if (titleSuccess) {
      setIsEditing(false);
    }
  }, [titleSuccess]);

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleOnBlur = () => {
    if (!editedTitle.trim()) {
      handleDelete();
    } else if (editedTitle !== title) {
      handleUpdate();
    } else {
      cancelEditing();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      cancelEditing();
    } else if (e.key === 'Enter') {
      handleOnBlur();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOnBlur();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={handleKeyUp}
            autoFocus={isEditing}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isNewTodoAdding ||
            (isTodoDeleting && todoIdsForRemoving?.includes(id)) ||
            idsForUpdate.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
