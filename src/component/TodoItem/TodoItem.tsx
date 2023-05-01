import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoTitle) {
      handleEdit(id, { title: todoTitle });
      setIsEditing(false);
    } else {
      onDelete(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const cancelEditing = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keyup', cancelEditing);

    return () => {
      document.removeEventListener('keyup', cancelEditing);
    };
  }, [isEditing]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleEdit(id, { completed: !completed })}
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
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isLoad,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <Loader isLoading={isLoad} />
      </div>
    </div>
  );
};
