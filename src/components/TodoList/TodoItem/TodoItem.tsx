/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  activeTodoIds: number[];
  onToggle: (id: number) => Promise<void>;
  onEdit: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  activeTodoIds,
  onToggle,
  onEdit,
}) => {
  const titleInput = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleInputChange = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      setNewTitle(event.target.value);
    }, [newTitle],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (event.detail === 2) {
        setIsEditing(true);
      }
    }, [isEditing],
  );

  const handleEscPressing = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    }, [newTitle, isEditing],
  );

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    await onEdit(todo.id, newTitle);
    setIsEditing(false);
  }, [newTitle]);

  const isActiveTodo = useMemo(() => (
    activeTodoIds.includes(todo.id)
  ), [activeTodoIds]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onToggle(todo.id)}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleInput}
              value={newTitle}
              onChange={handleInputChange}
              onKeyDown={handleEscPressing}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isActiveTodo },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
