/* eslint-disable */
import React, { useState, ChangeEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import "./TodoItem.scss";


type Props = {
  todo: Todo;
  handleOnDelete: (todoId: number) => Promise<void>;
  inProcess: number[];
  handleUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

const TodoItem: React.FC<Props> = ({ todo, handleOnDelete, inProcess, handleUpdate }) => {
  const { id, title, completed } = todo;
  const [textToEdit, setTextToEdit] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const isProcessing = inProcess.includes(id);

  const handleEdit = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTextToEdit(event.target.value);
  };

  const handleSavings = (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmed = textToEdit.trim();
    if (trimmed.length === 0) {
      handleOnDelete(id)
        .then(() => { setIsEditing(false) })
        .catch(() => { setIsEditing(true) })
      return;
    }
    if (trimmed === title) {
      setIsEditing(false);
      return;
    }

    handleUpdate(id, { title: trimmed })
      .then(() => { setIsEditing(false) })
      .catch(() => { setIsEditing(true) });
  }

  const cancelEdit = () => {
    setIsEditing(false);
    setTextToEdit(title);
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdate(id, { completed: !completed })}
        />
      </label>

      {isEditing ? (
        <form className="form" onSubmit={handleSavings}>
            <input
              data-cy="TodoTitleField"
              className="todo__edit"
              placeholder="Empty todo will be deleted"
              type="text"
              value={textToEdit}
              onChange={handleEdit}
              onBlur={() => handleSavings()}
              onKeyUp={(e) => { if (e.key === 'Escape') cancelEdit(); }}
              autoFocus
            />
        </form>
      ) : (
        <span
          data-cy="TodoTitle" className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          <label>{title}</label>
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleOnDelete(id)}
        >
          ×
        </button>
      )}

      <div data-cy="TodoLoader" className={cn('modal overlay', {
        'is-active': isProcessing
      })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
