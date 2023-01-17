import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isAdding?: boolean,
  handleDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  deletedId?: number[] | null,
  handleToggle?: (event: React.MouseEvent<HTMLInputElement>) => void,
  updatedTitleId?: number | null,
  hanldleCreateTitleForm?: (event: React.MouseEvent<HTMLSpanElement>) => void,
  handleChangeTodoTitle?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  newTitle?: string,
  handlesSubmitNewTitle?: (event: React.FormEvent<HTMLFormElement>) => void,
  handleBlur?: () => void,
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  handleDelete,
  deletedId,
  handleToggle,
  updatedTitleId,
  hanldleCreateTitleForm,
  handleChangeTodoTitle,
  newTitle,
  handlesSubmitNewTitle,
  handleBlur,
  handleKeyDown,
}) => {
  const { title, id, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter-done', { completed })}
    >
      <label className="todo__status-label">
        <input
          name={`${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleToggle}
        />
      </label>

      {updatedTitleId === id
        ? (
          <form onSubmit={handlesSubmitNewTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={newTitle}
              onChange={handleChangeTodoTitle}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </form>
        )
        : (
          <>
            <span
              id={`${id}`}
              title={title}
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={hanldleCreateTitleForm}
            >
              {title}
            </span>
            <button
              name={`${id}`}
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDelete}
            >
              ×
            </button>

          </>
        )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': isAdding
              || deletedId?.find(el => el === id),
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
