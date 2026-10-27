/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodoEditing } from '../../hooks/useTodoEditing';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoading?: boolean;
  onToggleStatus: (todo: Todo) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading = false,
  onToggleStatus,
  onUpdate,
}) => {
  const {
    inputRef,
    isEditing,
    newTitle,
    setNewTitle,
    startEditing,
    handleSave,
    handleSubmit,
    handleKeyUp,
  } = useTodoEditing({ todo, onDelete, onUpdate });

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
          onChange={() => onToggleStatus(todo)}
        />
      </label>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
