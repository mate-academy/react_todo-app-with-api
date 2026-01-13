/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo?: () => Promise<void>;
  onToggleTodo?: (todo: Todo) => Promise<void>;
  onUpdateTodo?: (
    todoId: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false); //показываем текст или input
  const [editedTitle, setEditedTitle] = useState(todo.title); //что сейчас написано в поле редактирования

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const handleDoubleClick = () => setIsEditing(true);
  const submitChanges = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      onDeleteTodo?.()?.then(() => setIsEditing(false));

      return;
    }

    if (trimmed !== todo.title) {
      onUpdateTodo?.(todo.id, { title: trimmed }).then(() =>
        setIsEditing(false),
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = () => submitChanges();

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleTodo?.(todo)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            submitChanges();
          }}
          //className={cn('todo__edit-form', { hidden: !isEditing })}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedTitle(todo.title);
              }
            }}
            //autoFocus
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            // onDoubleClick={() => setIsEditing(true)}
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDeleteTodo}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
