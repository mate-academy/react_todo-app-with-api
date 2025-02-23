import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  isProcessed: boolean;
  onTodoUpdate: (todo: TodoType) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed,
  onTodoUpdate,
}) => {
  const fieldTitle = useRef<HTMLInputElement>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    if (isEdit) {
      fieldTitle.current?.focus();
    }
  }, [isEdit]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsEdit(false);
        setNewTitle(todo.title);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [todo.title]);

  const handleOnChange = () => {
    onTodoUpdate({
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

    if (title === '') {
      onDelete(todo.id);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: title,
    };

    onTodoUpdate(updatedTodo)
      .then(() => setIsEdit(false))
      .catch(() => fieldTitle.current?.focus());
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
