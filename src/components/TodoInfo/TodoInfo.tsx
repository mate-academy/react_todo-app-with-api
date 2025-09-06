/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/todo';

interface Props {
  todo: Todo;
  removeTodo: (arg: number) => Promise<boolean>;
  isProcessing: boolean;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<boolean>;
  editingTodoId: number | null;
  onEdit: (todoId: number | null) => void;
}

const TodoInfoComponent: React.FC<Props> = ({
  todo,
  removeTodo,
  isProcessing,
  onUpdate,
  editingTodoId,
  onEdit,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const isEditing = editingTodoId === todo.id;

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      onEdit(null);

      return;
    }

    if (trimmedTitle === '') {
      const removedSuccessfully = await removeTodo(todo.id);

      if (removedSuccessfully) {
        onEdit(null);
      }

      return;
    }

    const updateSuccessfull = await onUpdate(todo.id, { title: trimmedTitle });

    if (updateSuccessfull) {
      onEdit(null);
    }
  }, [newTitle, todo.title, todo.id, onEdit, removeTodo, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        onEdit(null);
      }
    },
    [onEdit],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSave();
    },
    [handleSave],
  );

  const handleNewTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    },
    [],
  );

  const handleDoubleClick = useCallback(() => {
    onEdit(todo.id);
  }, [onEdit, todo.id]);

  const handleToggle = useCallback(() => {
    onUpdate(todo.id, { completed: !todo.completed });
  }, [onUpdate, todo.id, todo.completed]);

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            id={`todo-title-${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleToggle}
            disabled={isProcessing}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={editFieldRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleNewTitle}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => removeTodo(todo.id)}
              disabled={isProcessing}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isProcessing })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

export const TodoInfo = React.memo(TodoInfoComponent);
