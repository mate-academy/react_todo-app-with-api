import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  loadingTodos: number[],
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingTodos,
  onUpdateTodo,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [inEditMode, setInEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const isLoading = loadingTodos.includes(id);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      onDeleteTodo(id);
      setInEditMode(false);

      return;
    }

    if (newTitle.trim() === title) {
      setInEditMode(false);

      return;
    }

    onUpdateTodo(id, { title: newTitle });
    setInEditMode(false);
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      onDoubleClick={() => {
        setInEditMode(true);
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onUpdateTodo(id, { completed: !completed });
          }}
          checked={completed}
        />
      </label>

      {inEditMode ? (
        <form onSubmit={handleTitleChange}>
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleTitleChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{ title }</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isLoading,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
