import cn from 'classnames';
import { Todo } from '../types/Todo';
import { getTodoError, todosService, TodosServiceError } from '../api/todos';
import React, { useEffect, useRef, useState } from 'react';

type TodoProps = {
  todo: Todo;
  loading: boolean;
  onDelete: (todoId: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
  addLoadingId: (todoId: number) => void;
  removeLoadingId: (todoId: number) => void;
  setErrorMessage: (message: string) => void;
};

export const TodoItem = ({
  todo,
  loading = false,
  onDelete,
  onUpdateTodo,
  addLoadingId,
  removeLoadingId,
  setErrorMessage,
}: TodoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  const markTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;

    addLoadingId(todo.id);

    todosService
      .update(todo.id, { completed: newValue })
      .then(updatedTodo => {
        onUpdateTodo(updatedTodo);
      })
      .catch(() => {
        setErrorMessage(getTodoError(TodosServiceError.UnableToUpdateTodo));
      })
      .finally(() => {
        removeLoadingId(todo.id);
      });
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEditSubmit = (event: React.FormEvent | React.FocusEvent) => {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    if (todo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    addLoadingId(todo.id);

    todosService
      .update(todo.id, { title: trimmedTitle })
      .then(updatedTitle => {
        onUpdateTodo(updatedTitle);
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(getTodoError(TodosServiceError.UnableToUpdateTodo));
      })
      .finally(() => {
        removeLoadingId(todo.id);
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={markTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleEditSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setNewTitle(todo.title);

                setIsEditing(false);
              }
            }}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
