import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import type { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => Promise<number | void>;
  hasLoader: boolean;
  onUpdate: (id: number, newData: Partial<Todo>) => Promise<void>;
  createTodoInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const {
    todo,
    onDelete,
    hasLoader,
    onUpdate,
    createTodoInputRef,
  } = props;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const editTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editTitleInputRef.current?.focus();
  }, [isBeingEdited]);

  const handleDeleteButton = () => {
    onDelete(todo.id)
      .catch(() => {})
      .finally(() => {
        createTodoInputRef.current?.focus();
      });
  };

  const handleTitleEdit = () => {
    setIsBeingEdited(true);
    setNewTitle(todo.title);
  };

  const handleSaveNewTitle = () => {
    const preparedTitle = newTitle.trim();

    if (!preparedTitle) {
      onDelete(todo.id).catch(() => editTitleInputRef.current?.focus());

      return;
    }

    if (preparedTitle === todo.title) {
      setIsBeingEdited(false);

      return;
    }

    onUpdate(todo.id, { title: preparedTitle })
      .then(() => {
        setIsBeingEdited(false);
      })
      .catch(() => { });

    editTitleInputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleSaveNewTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isBeingEdited
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleSaveNewTitle}
              onKeyUp={handleKeyUp}
              ref={editTitleInputRef}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTitleEdit}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteButton}
            >
              x
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': hasLoader },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
