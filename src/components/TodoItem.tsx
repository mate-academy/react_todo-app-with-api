import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number[]) => void;
  onUpdate?: (todoDataUpdate: [Todo]) => Promise<Todo | null>[];
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed, userId }, // Деструктуризація з userId
  onDelete = () => {},
  onUpdate = () => [],
  isLoading,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [hasEditTitleFocus, setHasEditTitleFocus] = useState(false);
  const titleEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleEditRef.current?.focus();
  }, [hasEditTitleFocus]);

  const handleTodoUpdate = () => {
    const formattedEditTitle = editTitle.trim();

    if (!formattedEditTitle) {
      onDelete([id]);

      return;
    }

    if (formattedEditTitle !== title) {
      setEditTitle(formattedEditTitle);
      setHasEditTitleFocus(false);

      const preparedEditTodoUpdate = {
        id,
        title: formattedEditTitle,
        completed,
        userId,
      };

      onUpdate([preparedEditTodoUpdate]).forEach(promise => {
        promise.then(response => {
          if (!response) {
            setHasEditTitleFocus(true);
          }
        });
      });
    } else {
      setEditTitle(title);
      setHasEditTitleFocus(false);
    }
  };

  const handleEditTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTodoUpdate();
  };

  const handleTodoToggle = () => {
    const preparedToggleTodoUpdate = {
      id,
      title,
      completed: !completed,
      userId,
    };

    onUpdate([preparedToggleTodoUpdate]);
  };

  const handleTodoKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(title);
      setHasEditTitleFocus(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoToggle}
        />
      </label>

      {hasEditTitleFocus ? (
        <form onSubmit={handleEditTodoSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleEditRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleTodoUpdate}
            onKeyUp={handleTodoKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setHasEditTitleFocus(true)}
          >
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
