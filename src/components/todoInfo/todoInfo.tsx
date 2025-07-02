import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoInfoProps {
  todo: Todo;
  deletedTodos?: number[];
  updatedTodos?: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number) => void;
  onUpdateTitle: (
    e: React.FormEvent<HTMLFormElement>,
    todoId: number,
    newTitle: string,
  ) => void;
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  todo,
  deletedTodos,
  updatedTodos,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(todo.title);
  const checkboxId = `todo-status-${todo.id}`;
  const hasSubmitted = React.useRef(false);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={async e => {
            e.preventDefault();
            hasSubmitted.current = true;
            try {
              await onUpdateTitle(e, todo.id, tempValue);
              setIsEditing(false);
            } catch (error) {
              // Handle error if needed
            }
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setTempValue(todo.title);
              }
            }}
            onBlur={async e => {
              if (!hasSubmitted.current) {
                try {
                  //eslint-disable-next-line
                  await onUpdateTitle(e as any, todo.id, tempValue);
                  setIsEditing(false);
                } catch (error) {
                  // Handle error if needed
                }
              }

              hasSubmitted.current = false;
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isEditing}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            todo.id === 0 ||
            deletedTodos?.includes(todo.id) ||
            updatedTodos?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
