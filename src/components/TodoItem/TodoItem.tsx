import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loading: boolean,
  onChecked: (todoId: number, data: {}) => void,
  onChangeTitle: (todoId: number, title: string) => void,
  onRemove: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onChecked,
  onChangeTitle,
  onRemove,
}) => {
  const { id, title, completed } = todo;
  const [titleInList, setTitleInList] = useState(title);
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(titleInList);

  const handleDoubleClick = () => {
    setEdit(true);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEditValue(event.target.value);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setTitleInList(editValue);
      onChangeTitle(todoId, editValue);
      setEdit(false);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setEditValue(titleInList);
      setEdit(false);
    }
  };

  const handleBlur = (todoId: number) => {
    setTitleInList(editValue);
    onChangeTitle(todoId, editValue);
    setEdit(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: completed === true },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChecked(id, { completed: !completed })}
        />
      </label>

      {!edit
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )

        : (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editValue}
              onChange={handleChange}
              onKeyDown={(event) => handleKeydown(event, id)}
              onBlur={() => handleBlur(id)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': loading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
