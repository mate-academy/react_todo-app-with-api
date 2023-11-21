import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  processingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = (
  {
    todo, processingIds, onDelete, onUpdate,
  },
) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [isEditing]);

  const updateTitle = () => {
    switch (newTitle.trim()) {
      case '':
        onDelete(todo.id);
        break;
      case todo.title:
        setIsEditing(false);
        break;
      default:
        onUpdate({ ...todo, title: newTitle });
    }

    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTitle();
    setIsEditing(false);
  };

  const handleChecked = (toDo: Todo) => {
    onUpdate({ ...toDo, completed: !toDo.completed });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <li
      className={cn(
        'todo',
        {
          completed,
          editing: isEditing,
        },
      )}
    >
      <label
        className="todo__status-label"
        htmlFor={`toggle-view-${id}`}
      >
        <input
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${id}`}
          onClick={() => handleChecked(todo)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={field}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={updateTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            aria-label="Delete Todo"
            onClick={() => onDelete(id)}
          >
            x
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
