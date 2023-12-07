import React from 'react';
import cn from 'classnames';
import { Todo } from '../types';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  handleEditTodo: (id: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
  onToggleTodo,
  handleEditTodo,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const cansleEditing = () => {
    setIsEditing(false);
    setTitle(todo.title);
  };

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement> |
  React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      onDeleteTodo(todo.id);

      return;
    }

    if (title === todo.title) {
      cansleEditing();

      return;
    }

    handleEditTodo(todo.id, title);
    setIsEditing(false);
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            onToggleTodo(todo.id);
          }}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTitleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={handleTitleChange}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  cansleEditing();
                }
              }}
              onBlur={handleTitleSubmit}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                onDeleteTodo(todo.id);
              }}
            >
              ×
            </button>

          </>
        )}

      {isLoading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
