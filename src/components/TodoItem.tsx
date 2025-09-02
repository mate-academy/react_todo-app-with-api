import React, { useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/todos';

type Props = {
  todo: Todo;
  editId: number | null;
  pendingIds: number[];
  onUpdate: (id: number, data: Partial<Todo>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onEdit: (id: number) => void;
  onSave: (id: number, newValue: string, oldValue: string) => Promise<void>;
  onFormSave: (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
    old: string,
  ) => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editId,
  pendingIds,
  onUpdate,
  onDelete,
  onEdit,
  onSave,
  onFormSave,
  onKeyDown,
}) => {
  const editFieldRef = useRef<HTMLInputElement>(null);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          aria-label="Toggle todo status"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
          disabled={pendingIds.includes(todo.id) || todo.id === 0}
        />
      </label>

      {editId === todo.id ? (
        <form onSubmit={e => onFormSave(e, todo.id, todo.title)}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            defaultValue={todo.title}
            autoFocus
            onBlur={e => onSave(todo.id, e.target.value, todo.title)}
            onKeyDown={onKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEdit(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={pendingIds.includes(todo.id) || todo.id === 0}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': pendingIds.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
