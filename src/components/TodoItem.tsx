/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  isProcessing?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, status: boolean) => void;
  onDoubleClick?: (todo: Todo | null) => void;
  selectedTodo?: Todo | null;
  onUpdate?: (id: number, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onToggle = () => {},
  onDoubleClick = () => {},
  selectedTodo = null,
  isTempTodo = false,
  isProcessing = false,
  onUpdate = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);

  const isLoading = isTempTodo || isProcessing;
  const isEditing = selectedTodo?.id === todo.id;
  const [title, setTitle] = useState<string>(todo.title);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          disabled={isLoading || isEditing}
        />
      </label>
      {selectedTodo?.id === todo.id ? (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={title}
          onChange={event => setTitle(event.target.value)}
          onBlur={() => {
            if (submittedRef.current) {
              submittedRef.current = false;

              return;
            }

            onUpdate(todo.id, title);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              submittedRef.current = true;
              onUpdate(todo.id, title);
            }

            if (e.key === 'Escape') {
              onDoubleClick(null);
            }
          }}
          ref={inputRef}
          autoFocus
          onFocus={e => e.currentTarget.select()}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onDoubleClick(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            x
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
