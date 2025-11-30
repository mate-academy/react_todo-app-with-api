import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

export const TodoItem: React.FC<{
  todo: Todo;
  busy?: boolean;
  loading?: boolean;
  onToggle?: (id: Todo['id'], completed: boolean) => Promise<void> | void;
  onDelete?: (id: Todo['id']) => Promise<boolean> | void;
  onUpdate?: (id: Todo['id'], title: string) => Promise<boolean> | void;
}> = ({
  todo,
  busy = false,
  loading = false,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const isBusy = busy || loading;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isSavingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      setValue(todo.title);
      inputRef.current?.focus();
    }
  }, [editing, todo.title]);

  const save = async () => {
    if (isSavingRef.current) {
      return;
    }

    const trimmed = value.trim();

    if (trimmed === todo.title) {
      setEditing(false);

      return;
    }

    if (trimmed === '') {
      if (!onDelete) {
        setEditing(false);

        return;
      }

      isSavingRef.current = true;
      try {
        const ok = await onDelete(todo.id);

        if (ok) {
        } else {
          setValue('');
          setEditing(true);
        }
      } finally {
        isSavingRef.current = false;
      }

      return;
    }

    if (onUpdate) {
      isSavingRef.current = true;
      try {
        const ok = await onUpdate(todo.id, trimmed);

        if (ok) {
          setEditing(false);
        } else {
          setEditing(true);
        }
      } finally {
        isSavingRef.current = false;
      }
    } else {
      setEditing(false);
    }
  };

  const cancel = () => {
    setEditing(false);
    setValue(todo.title);
  };

  const handleTitleDoubleClick = () => {
    if (!isBusy) {
      setEditing(true);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' && !isBusy) {
      setEditing(true);
      e.currentTarget.blur();
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e => void onToggle?.(todo.id, e.target.checked)}
          disabled={isBusy}
        />
        <span className="visually-hidden">Toggle todo</span>
      </label>

      {!editing ? (
        <>
          <div
            data-cy="TodoTitle"
            className="todo__title"
            role="button"
            tabIndex={0}
            onDoubleClick={handleTitleDoubleClick}
            onKeyDown={handleTitleKeyDown}
          >
            {todo.title}
          </div>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => void onDelete?.(todo.id)}
            disabled={isBusy}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            void save();
          }}
          style={{ display: 'inline' }}
        >
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            className="todo__edit"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={() => {
              void save();
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                cancel();
              }
            }}
            disabled={isBusy}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isBusy ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoList: React.FC<{
  todos: Todo[];
  loading: boolean;
  busyIds: Record<string, boolean>;
  onToggle: (id: Todo['id'], completed: boolean) => Promise<void>;
  onDelete: (id: Todo['id']) => Promise<boolean>;
  onUpdate: (id: Todo['id'], title: string) => Promise<boolean>;
}> = ({ todos, loading, busyIds, onToggle, onDelete, onUpdate }) => {
  if (loading) {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <div className="todoapp__loading">Loading...</div>
      </section>
    );
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length === 0 ? (
        <div className="todoapp__empty">No todos</div>
      ) : (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            busy={!!busyIds[String(todo.id)]}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </section>
  );
};
