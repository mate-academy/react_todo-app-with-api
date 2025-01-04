/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  processing: number | null;
  todosQuantity: number;
  setTodosQuantity: (todosQuantity: number) => void;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (redactedTodo: Todo) => Promise<void>;
  isEditing: number | null;
  setIsEditing: (isEditing: number | null) => void;
};

export const TodoMain: React.FC<Props> = ({
  todo,
  processing,
  onDelete,
  onUpdate,
  todosQuantity,
  setTodosQuantity,
  isEditing,
  setIsEditing,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeCompleted = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    }).then(() =>
      setTodosQuantity(todo.completed ? todosQuantity + 1 : todosQuantity - 1),
    );
  };

  function confirmation() {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle.length) {
      return onDelete(todo.id)
        .catch(() => {
          throw new Error();
        })
        .then(() => setIsEditing(null));
    }

    return onUpdate({
      ...todo,
      title: trimmedTitle,
    })
      .catch(() => {
        throw new Error();
      })
      .then(() => setIsEditing(null));
  }

  const handleEditingTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(null);

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (newTitle === todo.title) {
        setIsEditing(null);

        return;
      }

      confirmation();
    }
  };

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleChangeCompleted}
        />
      </label>

      {isEditing === todo.id ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          ref={inputRef}
          onChange={stringEvent => setNewTitle(stringEvent.target.value)}
          onBlur={confirmation}
          onKeyUp={handleEditingTitle}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => !isEditing && setIsEditing(todo.id)}
          >
            {todo.title}
          </span>

          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processing === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
