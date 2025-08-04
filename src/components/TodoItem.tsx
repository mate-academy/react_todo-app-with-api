/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  editingTodo: number | null;
  editedTitle: string;
  handleDeleteTodo: (id: number) => void;
  handleStatusTodo: (todo: Todo) => void;
  handleEditTodo: (todo: Todo) => void;
  handleUpdateEditedTodo: (todo: Todo) => void;
  setEditedTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setEditingTodo: (todoId: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  editingTodo,
  editedTitle,
  handleDeleteTodo,
  handleStatusTodo,
  handleEditTodo,
  handleUpdateEditedTodo,
  setEditedTitle,
  setEditingTodo,
  inputRef,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label" htmlFor={`todo-title-${todo.id}`}>
      <input
        id={`todo-title-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => handleStatusTodo(todo)}
        readOnly
      />
    </label>

    {editingTodo === todo.id ? (
      <input
        data-cy="TodoTitleField"
        className="todo__title-field"
        value={editedTitle}
        onChange={e => setEditedTitle(e.target.value)}
        onBlur={() => handleUpdateEditedTodo(todo)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleUpdateEditedTodo(todo);
          }

          if (e.key === 'Escape') {
            setEditingTodo(null);
            setEditedTitle(todo.title);
          }
        }}
        ref={inputRef}
        autoFocus
      />
    ) : (
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => handleEditTodo(todo)}
      >
        {todo.title}
      </span>
    )}

    {/* Remove button appears only on hover */}
    {editingTodo !== todo.id && (
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal ${
        isDeleting || isUpdating ? ' is-active overlay' : ''
      }`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
