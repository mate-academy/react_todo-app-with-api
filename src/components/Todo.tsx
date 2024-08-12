/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';
import { TodoForm } from './TodoForm';
import { useTodo } from './hooks/useTodo';

interface Props {
  todo: TodoType;
  idsProccesing: number[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<TodoType>) => Promise<void>;
}

// Todo component
export const Todo: FC<Props> = ({ todo, onDelete, onEdit, idsProccesing }) => {
  const { completed, id, title } = todo;

  const {
    handleCompleted, // Handle completion status change
    handleDelete, // Handle deletion of todo
    handleTitleEdit, // Handle title editing
    setIsEditing, // Toggle editing mode
    inputRef, // Reference to input field
    isEditing, // Editing mode state
  } = useTodo({ onDelete, onEdit, todo });

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed, // Add 'completed' class if todo is completed
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleCompleted(!completed)} // Handle status change
          checked={completed}
        />
      </label>

      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <TodoForm
            title={title}
            onSubmit={handleTitleEdit} // Handle title edit submit
            inputRef={inputRef}
          />
        </div>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)} // Enable editing on double click
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete} // Handle deletion
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': idsProccesing.includes(id), // Show loader if processing
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
