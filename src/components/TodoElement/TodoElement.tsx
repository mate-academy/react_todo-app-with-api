import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  isLoading: boolean
  removeTodo: (id: number) => void
  updateTodo: (id: number, data: Partial<Omit<Todo, 'id' | 'userId'>>) => void
};

export const TodoElement: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleQuery, setTitleQuery] = useState(todo.title);
  const inputField = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const submitEditing = () => {
    if (titleQuery === '') {
      removeTodo(todo.id);
    } else if (todo.title !== titleQuery) {
      updateTodo(id, { title: titleQuery });
    }

    cancelEditing();
  };

  const handleEditingForm = (event: React.FormEvent) => {
    event.preventDefault();
    submitEditing();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {
            updateTodo(id, { completed: !completed });
          }}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleEditingForm}>
            <input
              type="text"
              className="todo__title-field"
              value={titleQuery}
              onChange={(event) => setTitleQuery(event.target.value)}
              onBlur={() => {
                submitEditing();
              }}
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(id)}
            >
              x
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
