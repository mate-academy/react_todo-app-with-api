/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletingIds: number[];
  updatingIds: number[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number) => Promise<void> | void;
  editingTodo: Todo | null;
  newTitle: string;
  setNewTitle: (value: string) => void;
  setEditingTodo: (todo: Todo | null) => void;
  saveEditedTodo: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingIds,
  updatingIds,
  toggleTodo,
  deleteTodo,
  editingTodo,
  newTitle,
  setNewTitle,
  setEditingTodo,
  saveEditedTodo,
}) => {
  const isEditing = editingTodo?.id === todo.id;

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTodo(todo);
            setNewTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <form
          onSubmit={event => {
            event.preventDefault();
            saveEditedTodo();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            autoFocus
            value={newTitle}
            onBlur={saveEditedTodo}
            onChange={event => setNewTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setEditingTodo(null);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          deletingIds.includes(todo.id) || updatingIds.includes(todo.id)
            ? 'is-active'
            : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
