import classNames from 'classnames';
import React, { FormEvent, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void,
  isLoad: boolean,
  handleEdit: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoad,
  handleEdit,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle) {
      handleEdit(id, { title: todoTitle });
    } else {
      onDelete(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  useEffect(() => {
    const cancelEditing = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', cancelEditing);

    return () => {
      document.removeEventListener('keydown', cancelEditing);
    };
  }, [isEditing]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleEdit(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              onBlur={handleCancel}
            />
          </form>
        ) : (
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
              onClick={() => onDelete(id)}
            >
              x
            </button>
          </>
        )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <Loader isLoad={isLoad} />
      </div>
    </div>
  );
};
