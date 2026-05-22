import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  todoLoadingIds: number[];
  deleteTodo: (id: number) => Promise<void>;
  todoComleted: (id: number, data: { completed: boolean }) => void;
  updateTodoTitle: (id: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  todoLoadingIds,
  deleteTodo,
  todoComleted,
  updateTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const isLoading = todoLoadingIds.includes(todo.id);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleEditSubmit = () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          editFieldRef.current?.focus();
        });

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    updateTodoTitle(todo.id, trimmedTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        editFieldRef.current?.focus();
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleEditSubmit();
    }

    if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEditSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${todo.id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            todoComleted(todo.id, { completed: todo.completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            ref={editFieldRef}
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(`modal overlay`, {
          'is-active': todoLoadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
