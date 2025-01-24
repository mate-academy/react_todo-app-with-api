import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';

interface Props {
  todo: Todo;
  onDelete: () => void;
  isDeleting: boolean;
  handleFocus: () => void;
  onCheck: () => void;
  editing: number | null;
  onEdit: (value: number | null) => void;
  onInput: React.RefObject<HTMLInputElement | null>;
  onSubmit: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting,
  handleFocus,
  onCheck,
  editing,
  onEdit,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>(todo.title);

  const handleDeleteAndFocus = async () => {
    onDelete();
    handleFocus();
  };

  const handleValidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (title.length === 0) {
        handleDeleteAndFocus();

        return;
      }

      if (title === todo.title) {
        onEdit(null);

        return;
      }

      await onSubmit({ ...todo, title });
    } catch (error) {
      onEdit(todo.id);
    } finally {
      onEdit(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEdit(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.addEventListener('keydown', handleKeyDown);
  }, [onEdit]);

  return (
    <div
      onDoubleClick={() => onEdit(todo.id)}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-status-${todo.id}`}
          checked={todo.completed}
          onClick={onCheck}
        />
      </label>

      {editing === todo.id ? (
        <form onSubmit={handleValidSubmit}>
          <input
            onBlur={() => onEdit(null)}
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteAndFocus}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
