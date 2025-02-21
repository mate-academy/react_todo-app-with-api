/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  loading: boolean;
  editingTodoId: number | null;
  editingField: React.RefObject<HTMLInputElement>;
  deleteTodo: (id: number) => Promise<boolean>;
  toggleCompletedField: (id: number) => Promise<boolean>;
  setEditingTodoId: (id: number | null) => void;
  editTodo: (id: number, title: string) => Promise<boolean>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  deleteTodo,
  toggleCompletedField,
  setEditingTodoId,
  editingTodoId,
  editingField,
  editTodo,
}) => {
  const [editedTitle, setEditedTitle] = useState('');
  const { id, title, completed } = todo;

  useEffect(() => {
    if (editingTodoId === id) {
      setEditedTitle(title);
      editingField.current?.focus();
    }
  }, [editingTodoId]);

  const saveChanges = () => {
    if (!editedTitle) {
      deleteTodo(id);
      setEditingTodoId(null);
      setEditedTitle('');

      return;
    }

    if (editedTitle === title) {
      setEditingTodoId(null);
    } else {
      editTodo(id, editedTitle.trim());
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditingTodoId(null);
    }
  };

  const handleBlur = () => {
    if (editingTodoId === id) {
      saveChanges();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompletedField(id)}
        />
      </label>

      {editingTodoId !== id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={submitForm}>
          <input
            ref={editingField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
