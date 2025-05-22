/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  handleDelete?: (todoId: Todo['id']) => Promise<boolean>;
  handleUpdate?: (
    todoId: Todo['id'],
    updatedFields: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  handleDelete = () => {},
  handleUpdate = () => {},
}) => {
  const [titleValue, setTitleValue] = useState(todo.title);
  const [showEditForm, setShowEditForm] = useState(false);
  const { id, title, completed } = todo;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showEditForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEditForm]);

  const handleEdit = async () => {
    const cleanTitle = titleValue.trim();

    if (!cleanTitle) {
      if (await handleDelete(id)) {
        setShowEditForm(false);
      }

      return;
    }

    if (cleanTitle === title) {
      setShowEditForm(false);

      return;
    }

    if (await handleUpdate(id, { title: cleanTitle })) {
      setShowEditForm(false);
    }
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleEdit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleValue(title);
      setShowEditForm(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => setShowEditForm(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdate(id, { completed: !completed })}
        />
      </label>

      {showEditForm ? (
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleValue}
            onChange={event => setTitleValue(event.target.value)}
            onBlur={handleEdit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};