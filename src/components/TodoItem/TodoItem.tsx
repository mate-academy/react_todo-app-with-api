import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  processedIds: number[],
  handleCheckbox: (id: number, value: boolean) => void,
  handleChangeTitle: (id: number, value: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  processedIds,
  handleCheckbox,
  handleChangeTitle,
}) => {
  const { title, id, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);

  const handleSubmitOrBlur = (event: FormEvent) => {
    event.preventDefault();

    if (titleInput === '') {
      deleteTodo(id);
    }

    if (title !== titleInput) {
      handleChangeTitle(id, titleInput);
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitleInput(title);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleCheckbox(id, completed)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmitOrBlur}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Edit title"
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              onBlur={handleSubmitOrBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay', {
          'is-active': id === 0 || processedIds.includes(id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
