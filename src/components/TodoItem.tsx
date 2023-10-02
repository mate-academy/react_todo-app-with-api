import React from 'react';
import { TodoItemProps } from '../types/TodoItem';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleTodoToggle,
  handleTodoDelete,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoToggle(todo.id, !todo.completed)}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={todo.title}
        />
      ) : (
        <button
          type="button"
          data-cy="TodoTitle"
          className="todo__title"
          onClick={() => setIsEditing(!isEditing)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setIsEditing(!isEditing);
            }
          }}
        >
          {todo.title}
        </button>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
