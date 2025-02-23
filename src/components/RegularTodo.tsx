import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoForm } from './TodoForm';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todo: Todo;
  deletingTodoId: number | null;
  idsProccesing: number[];
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<Todo>) => void;
  onError: (message: string) => void;
};

export const RegularTodo: React.FC<Props> = ({
  todo,
  deletingTodoId,
  idsProccesing,
  onDelete,
  onEdit,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(todo.id);
    } catch {
      onError(ErrorType.deleteError);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: Partial<Todo>) => {
    try {
      setLoading(true);
      await onEdit(todo.id, data);
    } catch {
      setLoading(false);
      onError(ErrorType.updateError);
      throw new Error(ErrorType.updateError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (title: string) => {
    const formattedTitle = title.trim();

    if (!formattedTitle) {
      return handleDelete();
    }

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await handleEdit({ title: formattedTitle });

      setIsEditing(false);
    } catch {
      // eslint-disable-next-line no-console
      inputRef.current?.focus();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */
      /*
  eslint-disable jsx-a11y/control-has-associated-label */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleEdit({ completed: !todo.completed })}
        />
      </label>
      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <TodoForm
            title={todo.title}
            onSubmit={handleSubmit}
            inputRef={inputRef}
          />
        </div>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletingTodoId === todo.id ||
            loading ||
            idsProccesing.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
