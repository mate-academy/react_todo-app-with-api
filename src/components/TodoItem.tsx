/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Loading } from '../types/Loading';

enum TodoKey {
  Title = 'title',
  Completed = 'completed',
}

type Props = {
  todo: Todo;
  loadingId: Loading;
  onEdit: (
    todo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  onDelete: (todoID: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = props => {
  const { todo, loadingId, onEdit, onDelete } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const titleForm = useRef<HTMLInputElement>(null);
  const isActive =
    Object.hasOwn(loadingId, todo.id) || isLoading || todo.id === 0;

  useEffect(() => {
    if (titleForm.current && isEditing) {
      titleForm.current.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    setLoading(true);

    onDelete(todo.id).finally(() => setLoading(false));
  };

  const handleEdit = () => {
    setLoading(true);

    onEdit(todo, TodoKey.Completed, !todo.completed).finally(() =>
      setLoading(false),
    );
  };

  const handleSubmitForm = () => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle.trim()) {
      handleDelete();

      return;
    }

    setLoading(true);
    onEdit(todo, TodoKey.Title, newTitle.trim())
      .then(res => setIsEditing(res))
      .finally(() => setLoading(false));
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleEdit}
        />
      </label>

      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <form
            onSubmit={event => {
              event.preventDefault();
              handleSubmitForm();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleForm}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleSubmitForm}
              onKeyUp={handleKeyUp}
            />
          </form>
        </div>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
