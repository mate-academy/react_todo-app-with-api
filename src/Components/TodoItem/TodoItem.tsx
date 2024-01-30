import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  updateTodo: (updatedTodo: Todo) => Promise<void>
  loader: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  loader,
}) => {
  const [editing, setEditing] = useState(false);
  const { title, completed } = todo;
  const [editingTitle, setEditingTitle] = useState(title);
  const field = useRef<HTMLInputElement>(null);

  function update(newTodo: Todo) {
    updateTodo(newTodo)
      .then(() => {
        setEditing(false);
      })
      .catch(() => field.current?.focus());
  }

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [editing]);

  const onToggle = () => {
    update({
      ...todo,
      completed: !completed,
    });
  };

  function save() {
    const trimEditedTitle = editingTitle.trim();

    if (title === trimEditedTitle) {
      setEditing(false);

      return;
    }

    if (trimEditedTitle) {
      update({
        ...todo,
        title: trimEditedTitle,
      });
    } else {
      deleteTodo?.(todo.id);
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    save();
  };

  const handelKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={onToggle}
          checked={completed}
        />
      </label>

      {editing
        ? (
          <form onSubmit={onSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={field}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onBlur={save}
              onChange={event => setEditingTitle(event.target.value)}
              onKeyUp={handelKeyUp}
            />

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': loader,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteTodo ? () => deleteTodo(todo.id) : undefined}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': loader,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
};
