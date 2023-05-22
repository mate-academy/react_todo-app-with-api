import {
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo, TodoStatus, TodoTitle } from '../../types/Todo';

interface Props {
  todo: Todo;
  isloadingId: number;
  onDelete: (todoId: number) => void;
  onEdit: (todoId: number, data: TodoTitle | TodoStatus) => void;
}

export const TodoItem: FC<Props> = ({
  todo: {
    id,
    title,
    completed,
  },
  isloadingId,
  onDelete: handleDeleteTodo,
  onEdit: handlePatchTodo,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleChangeCompleted = () => {
    const newStatus = {
      completed: !completed,
    };

    handlePatchTodo(id, newStatus);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const newTitle = {
      title: editedTitle.trim(),
    };

    if (!editedTitle.trim()) {
      handleDeleteTodo(id);

      return;
    }

    if (editedTitle.trim() === title) {
      setIsEdit(false);

      return;
    }

    setIsEdit(false);
    handlePatchTodo(id, newTitle);
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditedTitle(title);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener('keyup', handleEscape);
    setIsEdit(false);

    return (() => {
      document.removeEventListener('keyup', handleEscape);
    });
  }, [title]);

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    }
  }, [isEdit]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={handleChangeCompleted}
        />
      </label>

      {isEdit
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleSubmit}
              ref={inputRef}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdit(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isloadingId === id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
