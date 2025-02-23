import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  processing: boolean;
  todo: Todo;
  onDelete: () => Promise<void>;
  onChange: (todo: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  processing,
  todo,
  onDelete,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      titleField.current?.focus();
    }
  }, [editing]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(event.target.value);
  };

  const save = () => {
    const newTitle = formTitle.trim();

    if (newTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (!newTitle) {
      onDelete()
        .then(() => setEditing(false))
        .catch(() => setEditing(true));

      return;
    }

    onChange({ title: newTitle })
      .then(() => setEditing(false))
      .catch(() => setEditing(true));
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    save();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChange({ completed: !todo.completed })}
        />
      </div>
      {editing ? (
        <form onSubmit={onSubmitHandler}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={formTitle}
            ref={titleField}
            onBlur={save}
            onChange={onChangeHandler}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
              }
            }}
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
            data-cy="TodoDelete"
            onClick={() => onDelete()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': processing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
