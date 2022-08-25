import cn from 'classnames';
import {
  FC,
  FormEvent,
  memo,
  useCallback,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { EditTodoFrom } from './EditTodoForm';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoItem: FC<Props> = memo(({
  todo,
  isLoading,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const updateTitle = useCallback(() => {
    if (newTitle) {
      onUpdate(id, { title: newTitle });
    } else {
      onDelete(id);
    }
  }, [onDelete, onUpdate, newTitle]);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (title !== newTitle) {
      updateTitle();
    }

    setIsEditing(false);
  }, [updateTitle, title, newTitle]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id]);

  const handleDoubleClick = useCallback(() => {
    setNewTitle(title);
    setIsEditing(true);
  }, [title]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <EditTodoFrom
            handleSubmit={handleSubmit}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
          />
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {(isEditing || isLoading) && newTitle.length
              ? newTitle
              : title}
          </span>
        )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
