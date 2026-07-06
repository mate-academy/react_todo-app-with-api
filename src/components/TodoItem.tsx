/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from '../types/TempTodo';

type Props = {
  todo: Todo | TempTodo;
  isTemp: boolean;
  isLoading: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onStartEditing: (todo: Todo | TempTodo) => void;
  onEditingTitleChange: (title: string) => void;
  onCancelEditing: () => void;
  onSubmitTitle: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  isLoading,
  isEditing,
  editingTitle,
  onToggle,
  onDelete,
  onStartEditing,
  onEditingTitleChange,
  onCancelEditing,
  onSubmitTitle,
}) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''}`}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled={isLoading || isTemp}
        onChange={() => !isTemp && onToggle(todo as Todo)}
      />
    </label>

    {isEditing && !isTemp ? (
      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmitTitle(todo as Todo);
        }}
      >
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editingTitle}
          autoFocus
          onChange={event => onEditingTitleChange(event.target.value)}
          onBlur={() => onSubmitTitle(todo as Todo)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              onCancelEditing();
            }
          }}
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onStartEditing(todo)}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading || isTemp}
          onClick={() => !isTemp && onDelete(todo.id)}
        >
          ×
        </button>
      </>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
