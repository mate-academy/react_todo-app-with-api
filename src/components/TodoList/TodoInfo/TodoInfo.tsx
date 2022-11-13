import {
  FC, useState, memo, useCallback, FormEvent, useEffect,
  ChangeEvent, KeyboardEvent, useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => Promise<void>;
  isAdding?: boolean;
  deleteCompleted?: boolean;
  handleTodoUpdate?: (todoId: number, data: Partial<Todo>) => Promise<void>;
  isPatchingTodoIds?: number[];
};

export const TodoInfo: FC<Props> = memo(({
  todo,
  deleteTodo,
  isAdding,
  deleteCompleted,
  handleTodoUpdate,
  isPatchingTodoIds,
}) => {
  const titleInput = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  const isLoading = isAdding
    || isDeleting
    || (deleteCompleted && completed)
    || isPatchingTodoIds?.includes(id);

  const handleDelete = useCallback(() => {
    if (deleteTodo) {
      deleteTodo(id);
      setIsDeleting(true);
    }
  }, [deleteTodo]);

  const handleStatusChange = useCallback(() => {
    if (handleTodoUpdate) {
      handleTodoUpdate(id, { completed: !completed });
    }
  }, [handleTodoUpdate]);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
    const trimedNewTitle = newTitle.trim();

    if (trimedNewTitle === title) {
      return;
    }

    if (trimedNewTitle === '') {
      handleDelete();

      return;
    }

    if (handleTodoUpdate) {
      handleTodoUpdate(id, { title: trimedNewTitle });
    }
  }, [handleTodoUpdate, newTitle]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }, []);

  const handleEsc = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  }, [title]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleStatusChange}
        />
      </label>

      {isEditing ? (

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
            onChange={handleInput}
            onKeyDown={handleEsc}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
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
});
