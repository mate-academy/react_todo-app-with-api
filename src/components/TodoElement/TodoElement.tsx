/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  loading: boolean;
  onTodoDelete: (todo: Todo) => void;
  newTodoId: number | null;
  editedTitleTodoId: number | null;
  setEditedTitleTodoId: (id: number | null) => void;
  editedStatusTodoId: number | null;
  setEditedStatusTodoId: (id: number | null) => void;
  onUpdate: (updatedTodo: Todo, originalString?: string) => Promise<void>;
  titleInput: React.RefObject<HTMLInputElement>;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
}

export const TodoElement: React.FC<Props> = ({
  todo,
  loading,
  onTodoDelete,
  newTodoId,
  editedTitleTodoId,
  setEditedTitleTodoId,
  editedStatusTodoId,
  setEditedStatusTodoId,
  onUpdate,
  titleInput,
  editedTitle,
  setEditedTitle,
}) => {
  const handleTodoPick = () => {
    setEditedTitleTodoId(todo.id);
    setEditedTitle(todo.title);
  };

  const handleTitleChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(
      {
        id: todo.id,
        userId: todo.userId,
        title: editedTitle.trim(),
        completed: todo.completed,
      },
      todo.title,
    ).then(() => setEditedTitleTodoId(null));
  };

  const handleStatusChange = () => {
    setEditedStatusTodoId(todo.id);
    onUpdate({
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: !todo.completed,
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      {editedTitleTodoId !== todo.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoPick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleTitleChange}
          onBlur={event => {
            if (todo.title === editedTitle) {
              setEditedTitleTodoId(null);
            } else if (!editedTitle) {
              onTodoDelete(todo);
            } else {
              handleTitleChange(event);
            }
          }}
        >
          <input
            ref={titleInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onKeyDown={event => {
              if (
                event.key === 'Escape' ||
                (event.key === 'Enter' && todo.title === editedTitle)
              ) {
                setEditedTitleTodoId(null);
              } else if (event.key === 'Enter' && !editedTitle) {
                onTodoDelete(todo);
              }
            }}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            loading &&
            (newTodoId === todo.id ||
              editedTitleTodoId === todo.id ||
              editedStatusTodoId === todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
