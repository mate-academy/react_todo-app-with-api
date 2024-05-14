import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodos } from '../utils/TodoContext';
import { ErrText } from '../types/ErrText';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    onDelete,
    onUpdate,
    toggleCompleted,
    modifiedTodoId,
    setModifiedTodoId,
    loading,
    setLoading,
    setErrMessage,
  } = useTodos();
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && !loading) {
      inputRef.current?.focus();
    }
  }, [editing, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title || !trimmedTitle) {
      if (!trimmedTitle) {
        try {
          await onDelete(id);
        } catch (error) {
          setErrMessage(ErrText.DeleteErr);
        } finally {
          setLoading(false);
          setModifiedTodoId(0);
        }
      }

      setEditing(false);
      setUpdatedTitle(title);

      return;
    }

    setLoading(true);
    try {
      await onUpdate({ ...todo, title: trimmedTitle });
      setEditing(false);
    } catch (error) {
      setErrMessage(ErrText.UpdateErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    } finally {
      setLoading(false);
      setModifiedTodoId(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompleted(todo)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={updatedTitle}
            onChange={e => setUpdatedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setLoading(true);
              setModifiedTodoId(id);
              onDelete(id)
                .catch(() => {
                  setErrMessage(ErrText.DeleteErr);
                  setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
                })
                .finally(() => {
                  setLoading(false);
                  setModifiedTodoId(0);
                });
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === modifiedTodoId && loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
