import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  updateToggle: (toggleTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  loadingTodoId: number[];
  updateTodo: (updatedTodo: Todo) => Promise<void>;
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
    const trimmedTitle = editedTitle.trim();
    const reset = () => setEditing(false);

    if (trimmedTitle.length === 0) {
      deleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === title) {
      reset();

      return;
    }

    const updatedTodo = { ...todo, title: trimmedTitle };

    updateTodo(updatedTodo).then(reset);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateToggle(todo)}
        />
      </label>

      {editing ? (
        <form
          onSubmit={handleEditSubmit}
          onBlur={handleEditSubmit}
          onKeyUp={e => (e.key === 'Escape' ? setEditing(false) : '')}
        >
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
