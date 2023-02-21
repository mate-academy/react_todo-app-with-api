import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isAdding?: boolean;
  clearCompleted: boolean;
  changeTodo: (
    id: number,
    title: string,
    changeCompletedStatus?: boolean
  ) => void,
  processedTodo: number[],
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  isAdding,
  clearCompleted,
  changeTodo,
  processedTodo,
}) => {
  const [editTitle, setEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { completed, title, id } = todo;
  const applyNewTitle = () => {
    setEditTitle(false);

    if (!newTitle) {
      onDelete(id);

      return;
    }

    if (newTitle && newTitle !== title) {
      changeTodo(id, newTitle, false);
    }
  };

  useEffect(() => {
    if (clearCompleted && completed) {
      onDelete(id);
    }
  }, [clearCompleted, completed]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => changeTodo(id, title)}
        />
      </label>

      {(editTitle)
        ? (
          <form
            onSubmit={applyNewTitle}
          >
            <input
              data-cy="TodoTitle"
              className="todo__title-field"
              type="text"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={applyNewTitle}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setEditTitle(false);
                }
              }}
            />
          </form>
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditTitle(true);
              setNewTitle(title);
            }}
          >
            {title}
          </span>
        )}

      {editTitle || (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedTodo.includes(id) || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
