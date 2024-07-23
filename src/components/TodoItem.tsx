/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type TodoItemProps = {
  id: number;
  completed: boolean;
  title: string;
  updatedTodosId: number[];
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  failedTitleUpdateId: number;
  onSetFailedTitleUpdateId: (id: number) => void;
  onRemoveEmptyTodo: (id: number) => void;
};

export const TodoItem = ({
  id,
  completed,
  title,
  updatedTodosId,
  onRemove,
  onToggle,
  onUpdateTitle,
  failedTitleUpdateId,
  onSetFailedTitleUpdateId,
  onRemoveEmptyTodo,
}: TodoItemProps) => {
  const isUpdated = () => {
    return id < 0 || updatedTodosId.includes(id);
  };

  const [isTitleUpdated, setIsTitleUpdated] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [tmpTitle, setTmpTitle] = useState<string>('');

  useEffect(() => {
    if (titleRef.current && isTitleUpdated) {
      titleRef.current.focus();
      titleRef.current.value = tmpTitle.length > 0 ? tmpTitle : title;
    }
  }, [isTitleUpdated]);

  useEffect(() => {
    if (failedTitleUpdateId === id) {
      setIsTitleUpdated(() => true);
      onSetFailedTitleUpdateId(0);
    }
  }, [failedTitleUpdateId]);

  const hanldeKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsTitleUpdated(false);
      setTmpTitle('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    setIsTitleUpdated(() => false);

    if (
      !titleRef.current?.value ||
      titleRef.current.value.trim().length === 0
    ) {
      onRemoveEmptyTodo(id);
    } else if (titleRef.current.value.trim() === title) {
    } else {
      onUpdateTitle(id, titleRef.current.value.trim());
      setTmpTitle(titleRef.current.value);
    }

    event.preventDefault();
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      </label>

      {isTitleUpdated ? (
        <form
          onSubmit={event => handleSubmit(event)}
          onBlur={event => handleSubmit(event)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleRef}
            onKeyUp={event => hanldeKeyUp(event)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTitleUpdated(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemove(id)}
          >
            ×
          </button>
        </>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdated(),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
