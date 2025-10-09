/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo?: Todo;
  tempTodo?: Todo;
  onDeletedTodo?: (id: number) => Promise<void>;
  onToggle?: (todo: Todo) => void;
  loadingTodoIds?: number[];
  onEditingTodo?: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodo,
  onDeletedTodo,
  onToggle,
  loadingTodoIds,
  onEditingTodo = async () => {},
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [titleQuery, setTitleQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodo]);

  const currentTodo = todo || tempTodo;

  if (!currentTodo) {
    return null;
  }

  const { title, id, completed } = currentTodo;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const trimmedQuery = titleQuery.trim();

    if (!trimmedQuery.length) {
      setSubmitting(true);

      await onDeletedTodo!(editingTodo!.id)
        .then(() => setEditingTodo(null))
        .catch(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .finally(() => setSubmitting(false));
    } else if (trimmedQuery !== editingTodo?.title) {
      setSubmitting(true);

      await onEditingTodo(editingTodo!.id, trimmedQuery)
        .then(() => setEditingTodo(null))
        .catch(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .finally(() => setSubmitting(false));
    } else {
      setSubmitting(false);
      setEditingTodo(null);
    }
  };

  const handleBlur = async () => {
    const trimmedQuery = titleQuery.trim();

    if (submitting) {
      return;
    }

    if (!trimmedQuery.length) {
      setSubmitting(true);

      await onDeletedTodo!(editingTodo!.id)
        .then(() => setEditingTodo(null))
        .catch(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .finally(() => setSubmitting(false));
    } else if (trimmedQuery !== editingTodo?.title) {
      setSubmitting(true);

      await onEditingTodo(editingTodo!.id, trimmedQuery)
        .then(() => setEditingTodo(null))
        .catch(() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .finally(() => setSubmitting(false));
    } else {
      setSubmitting(false);
      setEditingTodo(null);
    }
  };

  const handleEditingTodo = (selectedTodo: Todo) => {
    setTitleQuery(selectedTodo.title);
    setEditingTodo(selectedTodo);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  const isLoaderActive = Boolean(
    tempTodo ||
      loadingTodoIds?.includes(id ?? -1) ||
      (!!loadingTodoIds?.length && editingTodo?.id === id),
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle!(todo!)}
        />
      </label>

      {!!editingTodo && editingTodo?.id === id ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleQuery}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditingTodo(todo!)}
          >
            {title || tempTodo?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeletedTodo!(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
