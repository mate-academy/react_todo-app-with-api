/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  memo, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todoItem: Todo,
  onDelete?: (id: number) => void,
  onUpdateTodo?: (updatedTodo: Todo) => void;
  loadingTodosPause: number[],
}

export const TodoItem: React.FC<Props> = memo(({
  todoItem,
  onDelete = () => { },
  onUpdateTodo,
  loadingTodosPause,
}) => {
  const {
    id, title, completed, userId,
  } = todoItem;
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  function toggleCompleted() {
    if (onUpdateTodo) {
      onUpdateTodo({
        title,
        id,
        userId,
        completed: !completed,
      });
    }
  }

  const onSubmit = async () => {
    if (title === newTitle) {
      setEditing(false);

      return;
    }

    if (onUpdateTodo) {
      await onUpdateTodo({
        ...todoItem,
        title: newTitle.trim(),
      });
    }

    setEditing(false);
  };

  const handleEdit = () => {
    setNewTitle(title);
    setEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', { completed },
      )}
      key={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDoubleClick={() => setEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleCompleted}
        />
      </label>

      {
        editing
          ? (
            <form
              onSubmit={onSubmit}
              onBlur={onSubmit}
            >
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
                onDoubleClick={handleEdit}
              />
            </form>
          ) : (
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
          )
      }

      {
        !editing && hover && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        )
      }

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodosPause.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
});
