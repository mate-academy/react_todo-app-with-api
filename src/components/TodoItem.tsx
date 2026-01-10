import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdateTodo,
}) => {
  const [isEditing, setIsisEditing] = useState(false);
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState(todo.title);

  useEffect(() => {
    titleInputRef?.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setEditValue(todo.title);
    setIsisEditing(false);
  }, [todo.title]);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleStatusChange = () => {
    onUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const handleEdit = () => {
    setEditValue(todo.title);
    setIsisEditing(true);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLInputElement>,
  ) => {
    if (event.type === 'submit') {
      event.preventDefault();
    }

    const newTitle: string = editValue.trim();

    if (newTitle === todo.title) {
      setIsisEditing(false);

      return;
    }

    if (newTitle === '') {
      onDelete(todo.id).then(() => setIsisEditing(false));

      return;
    }

    onUpdateTodo({ ...todo, title: newTitle });
  };

  const handleCancelEditing = (
    keyEvent: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (keyEvent.key === 'Escape') {
      setEditValue(todo.title);
      setIsisEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleStatusChange}
        />{' '}
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            ref={titleInputRef}
            onBlur={handleSubmit}
            onKeyUp={handleCancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
