import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  isProcessed: boolean;
  onUpdate: (todo: TodoType) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isProcessed,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const fieldTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fieldTitle.current?.focus();
  }, [isEdit]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsEdit(false);
        setNewTitle(todo.title);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [[]]);

  const handleOnChange = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const onSubmit = () => {
    const title = newTitle.trim();

    if (title === todo.title) {
      setIsEdit(false);

      return;
    }

    if (!title) {
      onDelete(todo.id);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: title,
    };

    onUpdate(updatedTodo)
      .then(() => setIsEdit(false))
      .catch(() => fieldTitle.current?.focus());
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleOnChange}
        />
      </label>

      {!isEdit ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleOnSubmit}>
          <input
            ref={fieldTitle}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => onSubmit()}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
