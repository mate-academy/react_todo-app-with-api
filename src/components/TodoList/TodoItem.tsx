import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  title: string,
  completed: boolean,
  isLoading: boolean,
  id: number
  handleDeleteTodo: (value: number) => void,
  handleCompleteTodo: (
    id: number,
    completed: boolean,
  ) => void,
  handleChangeTodoTitle: (
    id: number,
    newTitle: string,
  ) => void,
};

export const TodoItem: React.FC<Props> = ({
  title,
  completed,
  isLoading,
  id,
  handleDeleteTodo,
  handleCompleteTodo,
  handleChangeTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const editTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodo.current) {
      editTodo.current.focus();
    }
  }, [isEditing]);

  const handleEditedTitleSubmit = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setEditedTitle(trimmedTitle);
    } else if (!trimmedTitle) {
      handleDeleteTodo(id);
    } else {
      handleChangeTodoTitle(id, trimmedTitle);
    }

    setIsEditing(false);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleEditedTitleSubmit();
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo',
          {
            completed,
          })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
            onClick={() => handleCompleteTodo(id, !completed)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={onSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="What needs to be done? Deleted if empty"
              value={editedTitle}
              ref={editTodo}
              onChange={(event) => setEditedTitle(event.target.value)}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              onBlur={handleEditedTitleSubmit}
            />
          </form>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>

        )}

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay',
            {
              'is-active': isLoading,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
