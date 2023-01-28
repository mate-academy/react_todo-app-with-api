import React, { useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo;
  onDelete?: (id: number) => void;
  handleStatusChange?: (todo: Todo) => void
  updatingTodoIds?: number[];
  editTodo?: (todo: Todo, newTitle:string) => void;
};
export const TodoInfo:React.FC<Props>
  = ({
    onDelete,
    todo,
    handleStatusChange,
    updatingTodoIds,
    editTodo,
  }) => {
    const [isEditing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);

    const isLoaderActive = todo.id === 0
      || updatingTodoIds?.includes(todo.id);

    const handleEdit = () => {
      if (!title && onDelete) {
        onDelete(todo.id);
      }

      if (editTodo) {
        editTodo(todo, title);
        setEditing(false);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={cn('todo',
          { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {
              if (handleStatusChange) {
                handleStatusChange(todo);
              }
            }}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleEdit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onBlur={handleEdit}
              onChange={event => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setEditing(false);
                  setTitle(todo.title);
                }
              }}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                if (onDelete) {
                  onDelete(todo.id);
                }
              }}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoaderActive,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  };
