import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessed: boolean,
  onDelete?: (id: number) => void,
  onUpdate?: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [doubleClick, setDoubleClick] = useState(false);
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [doubleClick]);

  const handleTitleChange = () => {
    setDoubleClick(false);

    if (newTitle === todo.title) {
      return;
    }

    if (onDelete && onUpdate) {
      if (!newTitle.trim().length) {
        onDelete(todo.id);
      }

      onUpdate(todo.id, { title: newTitle });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => {
            if (onUpdate) {
              onUpdate(todo.id, { completed: !todo.completed });
            }
          }}
        />
      </label>

      {doubleClick ? (
        <form onSubmit={handleTitleChange}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={todoField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDoubleClick(false);
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setDoubleClick(true)}
        >
          {todo.title}
        </span>
      )}

      {(onDelete && !doubleClick) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal', 'overlay', { 'is-active': isProcessed },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
