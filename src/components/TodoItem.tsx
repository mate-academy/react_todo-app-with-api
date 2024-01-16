import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  loadingTodosId: number[];
  loader: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  loader,
}) => {
  const { title, completed, id: Id } = todo;
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const field = useRef<HTMLInputElement>(null);
  const onDeleted = (id: number) => {
    onDelete(id)
      .catch((error) => {
        throw error;
      });
  };

  function update(param: Todo) {
    onUpdate(param)
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

  function save() {
    if (loader) {
      return;
    }

    const trimedEdititngTitle = editingTitle.trim();

    if (title === trimedEdititngTitle) {
      setEditing(false);

      return;
    }

    if (trimedEdititngTitle) {
      update({ ...todo, title: trimedEdititngTitle });
    } else {
      onDelete(Id)
        .catch(() => field.current?.focus());
    }
  }

  const onToggle = () => {
    update({ ...todo, completed: !completed });
  };

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    save();
  }

  function handelKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditing(false);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', completed && 'completed')}
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
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleted(Id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
