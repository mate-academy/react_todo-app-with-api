/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: TodoType) => void;
  editingId: number | null;
  editedTitle: string;
  setEditedTitle: (value: string) => void;
  setEditingId: (id: number | null) => void;
  onRename: (todo: TodoType, title: string) => void;
};
export const Todo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  editingId,
  editedTitle,
  setEditedTitle,
  setEditingId,
  onRename,
}) => {
  const handleSubmit = async () => {
    if (editingId !== todo.id) return;
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);
      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);
      return;
    }

    await onRename(todo, trimmedTitle);
    setEditingId(null);
  };
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isLoading}
        />
      </label>

      {editingId === todo.id ? (
        // <form
        //   // key={todo.id}
        //   onSubmit={e => {
        //     e.preventDefault();
        //     handleSubmit();
        //   }}
        // >
        <input
          key="editing-input" // тоже тестик хз хуйня какая-то
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          // onBlur={() => {
          //   if (editingId === todo.id) {
          //     handleSubmit();
          //   }
          // }}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setEditedTitle(todo.title);
              setEditingId(null);
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      ) : (
        // </form>
        // <span
        //   data-cy="TodoTitle"
        //   className="todo__title"
        //   onDoubleClick={() => {
        //     setEditingId(todo.id);
        //     setEditedTitle(todo.title);
        //   }}
        // >
        //   {todo.title}
        // </span>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClickCapture={() => {
            console.log('DOUBLE CLICK WORKS', todo.id);
            setEditingId(todo.id);
            setEditedTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          x
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
        style={{ pointerEvents: 'none' }} // убрать если че
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
