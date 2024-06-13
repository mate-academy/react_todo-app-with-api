import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  updateToggle: (toggleTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  loadingTodoId: number[];
  updateTodo: (updatedTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateToggle,
  deleteTodo,
  loadingTodoId,
  updateTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const { completed, id, title } = todo;
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputFocusRef.current) {
      inputFocusRef.current?.focus();
    }
  }, [editing]);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTodo = { ...todo, title: editedTitle };

    updateTodo(updatedTodo);
    setEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateToggle(todo)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleEditSubmit} onBlur={handleEditSubmit}>
          <input
            ref={inputFocusRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => {
              setEditedTitle(e.target.value);
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
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingTodoId.includes(id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
