import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo
  processings: number[]
  onRemove: () => void
  onUpdate: (todo: Todo) => void
}

export const TodoItem: React.FC<Props> = React.memo((
  {
    todo,
    processings,
    onRemove = () => {},
    onUpdate = () => {},
  },
) => {
  const field = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(todo.title);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [editing]);

  const save = () => {
    setEditing(false);

    if (title === todo.title) {
      return;
    }

    if (!title) {
      onRemove();

      return;
    }

    onUpdate({ ...todo, title });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    save();
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={
        cn('todo', { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => onUpdate(
            { ...todo, completed: !todo.completed },
          )}
        />
      </label>

      {
        editing ? (
          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              data-cy="TodoTitleField"
              className="todo__title-field"
              type="text"
              ref={field}
              defaultValue={todo.title}
              onChange={event => setTitle(event.target.value)}
              onBlur={save}
              onKeyDown={event => handleEscape(event)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={onRemove}
            >
              ×
            </button>
          </>
        )
      }

      <div
        data-cy="TodoLoader"
        className={
          cn(
            'modal overlay',
            { 'is-active': processings.includes(todo.id) },
          )
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
