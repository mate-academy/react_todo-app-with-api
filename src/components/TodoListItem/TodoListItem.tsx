import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { useTodos } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoListItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo,
    deletingIds,
    deleteTodo,
    editingIds,
    updateTodoTitle,
  } = useTodos();

  const { title, completed, id } = todo;

  const [editing, setEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);

  const handleToggleTodo = () => {
    toggleTodo(id, todo);
  };

  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const saveTodo = () => {
    if (!editedTitle.trim()) {
      deleteTodo(id);
      setEditing(false);
    } else if (editedTitle.trim() === title) {
      setEditing(false);
    } else {
      setEditedTitle(editedTitle.trim());
      updateTodoTitle(id, {
        ...todo,
        title: editedTitle.trim(),
      });
      setEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditing(false);
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      saveTodo();
      setEditing(false);
    }
  };

  const isModalActive = deletingIds.includes(todo.id)
    || editingIds.includes(id);

  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveTodo();
    setEditing(false);
  };

  const handleBlur = () => {
    saveTodo();
    setEditing(false);
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isModalActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
