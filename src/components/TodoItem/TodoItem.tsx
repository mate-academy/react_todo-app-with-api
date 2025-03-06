import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  todosInProcess: number[];
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  todosInProcess,
  onUpdate,
  onDelete,
}) => {
  const { title, id, completed } = todo;

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUpdatedTitle(title);
    setIsEditing(false);
  }, [title]);

  useEffect(() => {
    if (isEditing && refInput.current) {
      refInput.current.focus();
    }
  }, [isEditing]);

  const handleTodoCompleted = () => {
    onUpdate({ ...todo, completed: !completed });
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (updatedTitle.trim() === title) {
      setIsEditing(false);

      return;
    } else if (updatedTitle.trim() === '') {
      onDelete(todo.id);
    } else if (updatedTitle !== title) {
      onUpdate({ ...todo, title: updatedTitle.trim() });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(title);
    }
  };

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoCompleted}
        />
        {/* accessible text */}
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {updatedTitle ? updatedTitle : title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={refInput}
            value={updatedTitle}
            onChange={handleUpdateTitle}
            onBlur={handleOnSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosInProcess.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
