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
        completed: todo.completed, // Add 'completed' class if todo is completed
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleCompleted(!todo.completed)} // Handle status change
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <TodoForm
            title={todo.title}
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
          {todo.title}
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
          'is-active': idsProccesing.includes(todo.id), // Show loader if processing
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
