import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo,
  deleteTodoHandler: (todoId: number) => void,
  processing: boolean;
  toggleCompletedTodo: (todoId: number) => void;
  onRename: (todo: Todo, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = (
  {
    todo, deleteTodoHandler, processing = false, toggleCompletedTodo, onRename,
  },
) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEditing(false);
  };

  const save = async () => {
    if (newTitle.trim()) {
      await onRename(todo, newTitle).then(() => {
        setNewTitle(newTitle.trim());
      }).catch(() => {
        setNewTitle(todo.title);
      });
    } else {
      await deleteTodoHandler(todo.id);
    }

    setEditing(false);
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => {
            toggleCompletedTodo(todo.id);
          }}
        />
      </label>

      {editing ? (
        <form onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
        >
          <input
            ref={inputRef}
            onBlur={save}
            onKeyDown={handleKeyDown}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}

          </span>
          <button
            onClick={() => deleteTodoHandler(todo.id)}
            type="button"
            className="todo__remove"
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': processing,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
