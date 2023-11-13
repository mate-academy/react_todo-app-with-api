import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  handleTodoDelete?: () => Promise<void>;
  onTodoUpdate?: (v: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = true,
  handleTodoDelete,
  onTodoUpdate,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const formInputRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    onTodoUpdate?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.length) {
      await handleTodoDelete?.();

      return;
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await onTodoUpdate?.({
        ...todo,
        title: newTitle.trim(),
      });
    } catch (error) {
      formInputRef.current?.focus();
      // console.warn('Some error occured while updated');
    }
  };

  const handleOnBlur = async () => {
    if (!newTitle.length) {
      await handleTodoDelete?.();

      return;
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await onTodoUpdate?.({
        ...todo,
        title: newTitle.trim(),
      });
    } catch (error) {
      formInputRef.current?.focus();
      // console.warn('Some error occured while updated');
    }
  };

  useEffect(() => {
    if (isEditing && formInputRef.current) {
      formInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn({
        completed: todo.completed,
      }, 'todo')}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>
      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
                setNewTitle(todo.title);
              }}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDelete}
            >
              ×
            </button>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
          >
            <input
              ref={formInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onBlur={handleOnBlur}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                  setNewTitle(todo.title);
                }
              }}
            />
          </form>
        )}

      {/* overlay will cover the todo while it is being updated */}
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
