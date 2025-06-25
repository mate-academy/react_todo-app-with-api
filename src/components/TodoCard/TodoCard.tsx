/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  changeTodoCompleteStatus?: (todoId: number, status?: boolean) => void;
  changeTodoTitle?: (
    todoId: number,
    title: string,
  ) => Promise<void> | undefined;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  deleteTodo,
  changeTodoCompleteStatus,
  changeTodoTitle,
}) => {
  const { id, title, completed, loading } = todo;

  const [editing, setEditing] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>(title);

  const handleEscapeDown = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      setEditing(false);
      setEditingTitle(title);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeDown);

    return () => {
      document.removeEventListener('keydown', handleEscapeDown);
    };
  }, []);

  const handleDelete = () => {
    deleteTodo(id);
  };

  const handleComplete = () => {
    if (changeTodoCompleteStatus) {
      changeTodoCompleteStatus(id);
    }
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleEditingSubmit = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (editingTitle === title) {
      setEditing(false);

      return;
    }

    if (changeTodoTitle) {
      changeTodoTitle(id, editingTitle.trim())?.then(() => {
        setEditing(false);
      });
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleComplete}
        />
      </label>

      {!editing && (
        <>
          {' '}
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {editing && (
        <form onSubmit={handleEditingSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={handleEditingSubmit}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
