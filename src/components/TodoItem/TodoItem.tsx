import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  processingIds: number[];
  removeTodo: (id: number) => void;
  onTodoUpdate: (todoId: number, data: unknown) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  processingIds,
  removeTodo,
  onTodoUpdate,
}) => {
  const { title, completed, id } = todo;

  const titleRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleDoubleClick = (event: React.MouseEvent) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const handleResetInputChange = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  const handleRemoveTodo = () => {
    removeTodo(id);
  };

  const handleToggle = () => {
    onTodoUpdate(id, { completed: !completed });
  };

  const handleSubmitTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (editedTitle === title) {
      setIsEditing(false);
    } else if (!editedTitle.trim().length) {
      removeTodo(id);
      setIsEditing(false);
    } else {
      onTodoUpdate(id, { title: editedTitle });
      setIsEditing(false);
      setEditedTitle(title);
    }
  }, [editedTitle]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleToggle}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmitTitle}
            onBlur={handleSubmitTitle}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleRef}
              defaultValue={title}
              onChange={e => setEditedTitle(e.target.value)}
              onKeyDown={handleResetInputChange}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              role="button"
              aria-hidden
              tabIndex={0}
              onClick={event => handleDoubleClick(event)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': processingIds.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
