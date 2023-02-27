import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  fetchDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
  handleUpdateTodo: (todo: Todo, title?: string) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  fetchDeleteTodo,
  isLoading,
  handleUpdateTodo,
}) => {
  const { title, completed, id } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [editing, setEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleCancelEdit = (event: { key: string; }) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setEditing(false);
    }
  };

  const preparedNewTitle = newTitle.trim();

  return (
    <div
      className={classNames(
        'todo', {
          completed,
        },
      )}
      onDoubleClick={() => {
        setEditing(true);
      }}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleUpdateTodo(todo)}
          readOnly
        />
      </label>

      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleUpdateTodo(todo, preparedNewTitle);
            setEditing(false);
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={({ target }) => {
              setNewTitle(target.value);
            }}
            ref={inputRef}
            onBlur={() => {
              handleUpdateTodo(todo, preparedNewTitle);
              setEditing(false);
            }}
            onKeyDown={handleCancelEdit}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              fetchDeleteTodo(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
