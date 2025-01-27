/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (userId: number) => Promise<boolean>;
  toggleTodoStatus: (todoId: number, completed: boolean) => void;
  updateTodoTitle: (todoId: number, newTitle: string) => Promise<boolean>;
  todosAreLoadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodoStatus,
  updateTodoTitle,
  todosAreLoadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    if (todo.id !== undefined) {
      setIsLoading(true);
      deleteTodo(todo.id).finally(() => setIsLoading(false));
    }
  };

  const handleStatusChange = () => {
    if (todo.id !== undefined) {
      toggleTodoStatus(todo.id, !todo.completed);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleUpdate = async () => {
    if (todo.id === undefined) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);

    if (trimmedTitle === '') {
      await deleteTodo(todo.id);
    } else {
      const success = await updateTodoTitle(todo.id, trimmedTitle);

      if (success) {
        setIsEditing(false);
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleUpdate();
  };

  const handleBlur = () => {
    handleTitleUpdate();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={editInputRef}
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
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || todosAreLoadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
