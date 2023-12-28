import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  todoIds: number[];
  onClick: (todo: Todo) => void;
  updateTitle?: (todo: Todo, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  todoIds,
  onClick,
  updateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && isEditing) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const deleteTodo = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const saveTitleChanges = () => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      deleteTodo();

      return;
    }

    if (updateTitle) {
      updateTitle(todo, trimmedTitle);
    }

    setIsEditing(false);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveTitleChanges();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onClick(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={titleField}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={handleOnKeyUp}
            onBlur={saveTitleChanges}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todoIds.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
