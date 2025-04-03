/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../../types/Todo';
import classNames from 'classnames';
import {
  TodoRemoveHandler,
  TodoRename,
  TodoUpdate,
} from '../../../types/TodoMethods';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onRemove?: TodoRemoveHandler;
  onToggle?: TodoUpdate;
  onRename?: TodoRename;
};
export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, isLoading, onRemove, onToggle, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputTitleRef = useRef<HTMLInputElement>(null);

    const handleTitleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleFormSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const newTitle = inputTitleRef.current?.value.trim() || '';

      if (newTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      if (onRename) {
        setIsProcessing(true);
        try {
          await onRename(todo, newTitle);
          setIsEditing(false);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    const handleRemoveTodo = () => {
      if (onRemove) {
        try {
          onRemove(todo.id);
        } catch {}
      }
    };

    const handleUpdateTodo = async () => {
      if (onToggle) {
        try {
          onToggle(todo, { completed: !todo.completed });
        } catch {}
      }
    };

    useEffect(() => {
      const handleEscapePress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsEditing(false);
        }
      };

      document.addEventListener('keydown', handleEscapePress);

      return () => {
        document.removeEventListener('keydown', handleEscapePress);
      };
    }, []);

    useEffect(() => {
      if (isEditing && inputTitleRef.current) {
        inputTitleRef.current.focus();
        inputTitleRef.current.value = todo.title;
      }
    }, [isEditing, todo.title]);

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleUpdateTodo}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleFormSubmit} onBlur={handleFormSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Leave empty to delete this todo..."
              ref={inputTitleRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTitleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isLoading || isProcessing,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
