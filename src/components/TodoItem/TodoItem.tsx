import React, { memo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoPatch } from '../../types/TodoPatch';
import { ESCAPE } from '../../utils/constants';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  onUpdateTodo?: (todoId: number, data: TodoPatch) => void,
  isLoading: boolean
};

export const TodoItem: React.FC<Props> = memo(
  ({
    todo,
    onDelete,
    onUpdateTodo = () => { },
    isLoading,
  }) => {
    const {
      id,
      title,
      completed,
    } = todo;

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const handleDeleteTodo = () => onDelete(id);

    const handleToggleTodo = () => {
      if (onUpdateTodo) {
        onUpdateTodo(id, { completed: !completed });
      }
    };

    const handleToggleEditing = () => setIsEditing(state => !state);

    const handleChangeNewTitle = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setNewTitle(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      if (!newTitle.trim().length) {
        onDelete(id);
      } else if (title !== newTitle) {
        setNewTitle(prevTitle => prevTitle.trim());
        onUpdateTodo(id, { title: newTitle });
      }

      handleToggleEditing();
    };

    const handleBlur = (event: React.FormEvent) => {
      handleSubmit(event);
    };

    const handleCancelEditing = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === ESCAPE) {
        setIsEditing(false);
        setNewTitle(title);
      }
    };

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
            onClick={handleToggleTodo}
            readOnly
          />
        </label>

        {isEditing
          ? (
            <form
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={handleChangeNewTitle}
                onBlur={handleBlur}
                onKeyUp={handleCancelEditing}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </form>
          )
          : (
            <span
              className="todo__title"
              onDoubleClick={handleToggleEditing}
            >
              {title}
            </span>
          )}

        <button
          type="button"
          className="todo__remove"
          onClick={handleDeleteTodo}
        >
          ×
        </button>

        <div
          className={classNames('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
