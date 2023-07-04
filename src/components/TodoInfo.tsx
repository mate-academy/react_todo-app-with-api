import React, {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletedTodosId: number[] | [];
  handleDeletedTodo: (id: number) => void;
  handleUpdatedTodo: (ids: number[], value: Partial<Todo>) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deletedTodosId,
  handleDeletedTodo,
  handleUpdatedTodo,
}) => {
  const { title, completed, id } = todo;
  const isDeleted = deletedTodosId.some(todoId => todoId === id);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleteButton = (todoId: number) => {
    if (handleDeletedTodo) {
      handleDeletedTodo(todoId);
    }
  };

  const handleTitleEdit = (
    event:
    FormEvent<HTMLFormElement>
    | ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (newTitle === '') {
      handleDeleteButton(id);

      return;
    }

    if (handleUpdatedTodo && title !== newTitle) {
      handleUpdatedTodo([id], { title: newTitle });
    } else {
      setIsEditing(false);
    }
  };

  const handleChangeStatus = () => {
    if (handleUpdatedTodo) {
      handleUpdatedTodo([id], { completed: !completed });
    }
  };

  useEffect(() => {
    setIsEditing(false);
  }, [todo]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => handleChangeStatus}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTitleEdit}>
            <input
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={(event) => handleTitleEdit(event)}
              onKeyUp={(event) => (
                event.key === 'Escape' && handleTitleEdit(event)
              )}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>
          </>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeletedTodo(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isDeleted,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
