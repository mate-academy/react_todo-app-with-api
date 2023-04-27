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
  const { id, completed, title } = todo;

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

  const onDeleteTodo = () => {
    deleteTodo(id);
  };

  const onChangeCheckbox = () => {
    handleCheckbox(id, completed);
  };

  const onChangeTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);
  };

  const onEditTitle = () => {
    setIsEditing(true);
  };

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onChangeCheckbox}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitOrBlur}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Edit title"
            value={titleInput}
            onChange={onChangeTitleInput}
            onBlur={handleSubmitOrBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={onEditTitle}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={onDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': id === 0 || processedIds.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
