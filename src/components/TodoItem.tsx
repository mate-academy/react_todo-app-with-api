/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleting: boolean;
  handleDelete: (todoId: number) => void;
  handleUpdate: (
    todoId: number,
    title: string,
    completed: boolean,
  ) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleting,
  handleDelete,
  handleUpdate,
}) => {
  const [editTitle, setEditTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleRename = (newTitle: string) => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      handleDelete(todo.id);

      return;
    }

    handleUpdate(todo.id, newTitle, todo.completed)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {});
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => {
            handleUpdate(todo.id, todo.title, !todo.completed);
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRename(editTitle.trim());
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            name="editTodo"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => handleRename(editTitle.trim())}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                cancelEditing();
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': deleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
