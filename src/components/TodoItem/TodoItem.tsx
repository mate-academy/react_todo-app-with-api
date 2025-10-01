import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { TodoState } from '../../types/TodoState';

type Props = {
  todo: Todo;
  isEditing: boolean;
  loadingState: TodoState | null;
  onOneTodoToggle?: (id: number) => void;
  onEditTodo?: (title: string, id: number) => void;
  onDoubleClick?: (id: number) => void;
  onTodoRemove?: (id: number) => void;
};

export const TodoItemComponent: React.FC<Props> = ({
  todo,
  isEditing,
  loadingState,
  onOneTodoToggle = () => {},
  onEditTodo = () => {},
  onDoubleClick = () => {},
  onTodoRemove = () => {},
}) => {
  const inputEditElement = useRef<HTMLInputElement>(null);
  const [editQuery, setEditQuery] = useState(todo.title);
  const [isProcessing, setIsProcessing] = useState(false);
  const isEditLoading = loadingState?.state === 'editloading';
  const isLoading = isEditLoading || loadingState?.state === 'loading';

  useEffect(() => {
    if (inputEditElement.current) {
      inputEditElement.current.focus();
    }
  }, [isEditing, isEditLoading]);

  const handleSubmit = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    onEditTodo(editQuery.trim(), todo.id);

    setTimeout(() => setIsProcessing(false), 0);
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => onOneTodoToggle(todo.id)}
        />
      </label>

      {isEditing || isEditLoading ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={inputEditElement}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editQuery}
            onChange={event => setEditQuery(event.target.value)}
            onBlur={() => handleSubmit()}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onDoubleClick(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoRemove(todo.id)}
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

export const TodoItem = React.memo(TodoItemComponent);
