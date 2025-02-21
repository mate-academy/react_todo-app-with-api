/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { LoadingType } from '../../types';
import { TodoEditForm } from '../TodoEditForm';

enum EditKeyOfTodo {
  Title = 'title',
  Completed = 'completed',
}

interface Props {
  todo: Todo;
  loadingIds: LoadingType;
  onEdit: (
    todo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  onDelete: (todoID: number) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingIds,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const titleFieldForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFieldForm.current && isEditing) {
      titleFieldForm.current.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    setLoading(true);

    onDelete(todo.id).finally(() => setLoading(false));
  };

  const handleEdit = () => {
    setLoading(true);

    onEdit(todo, EditKeyOfTodo.Completed, !todo.completed).finally(() =>
      setLoading(false),
    );
  };

  const handleSubmitForm = (value: string) => {
    if (value === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!value.trim()) {
      handleDelete();

      return;
    }

    setLoading(true);
    onEdit(todo, EditKeyOfTodo.Title, value.trim())
      .then(res => setIsEditing(res))
      .finally(() => setLoading(false));
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
          <TodoEditForm
            title={todo.title}
            onSubmit={handleSubmitForm}
            titleFieldForm={titleFieldForm}
          />
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
          'is-active':
            Object.hasOwn(loadingIds, todo.id) || isLoading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
