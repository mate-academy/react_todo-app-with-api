import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type TodoInfoProps = {
  todo: Todo
  onClickRemove?: (todoId: number) => void
  onClickLabel?: (todoId: number) => void
  loadingTodosIds?: number[]
  onDoubleClick?: (
    todoId: number,
    event: React.MouseEvent,
  ) => void
  onSubmit?: (todoId: number, title: string) => void
  doubleClickedTodoId?: number
};

export const TodoInfo = ({
  todo: { id, completed, title },
  onClickRemove,
  onClickLabel,
  loadingTodosIds,
  onDoubleClick,
  doubleClickedTodoId,
  onSubmit,
}: TodoInfoProps) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [showEditForm, setShowEditForm] = useState(false);

  const editInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const todoClassNames = classNames('todo', { completed });
  const modalClassNames = classNames('modal', 'overlay', {
    'is-active': id === 0 || loadingTodosIds?.includes(id),
  });
  const doubleClicked = doubleClickedTodoId === id;

  const handleDoubleClick = (event: React.MouseEvent) => {
    if (onDoubleClick) {
      onDoubleClick(id, event);
    }

    if (event.detail === 2) {
      setShowEditForm(true);
    }
  };

  const handleBlur = () => {
    editInput.current?.focus();
    form.current?.requestSubmit();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title === editedTitle.trim()) {
      setShowEditForm(false);
    } else if (onSubmit) {
      onSubmit(id, editedTitle);
    }
  };

  const handleEscapeClick = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowEditForm(false);
      setEditedTitle(title);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeClick);

    return () => {
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, []);

  useEffect(() => {
    editInput.current?.focus();
  }, [doubleClicked, showEditForm]);

  return (
    <div data-cy="Todo" className={todoClassNames}>
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onClickLabel && (() => onClickLabel(id))}
          onChange={() => {}}
        />
      </label>

      {showEditForm && doubleClicked ? (
        <form
          onSubmit={handleSubmit}
          ref={form}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            ref={editInput}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={handleDoubleClick}
            onKeyDown={() => { }}
            role="row"
            tabIndex={0}
          >
            {title}
          </span>

          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={onClickRemove && (() => onClickRemove(id))}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={modalClassNames}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
