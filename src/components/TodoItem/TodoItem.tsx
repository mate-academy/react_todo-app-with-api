import { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

export type TodoItemProps = {
  todo: Todo;
  isLoading: (todoId: Todo['id']) => boolean;
  onDelete: (todoId: Todo['id']) => void;
  onEditTodo: (
    todoId: Todo['id'],
    { fields }: { fields: Partial<Todo> },
  ) => Promise<void>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
  onEditTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggleSetEditing = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }

    setTitle(todo.title);
    setIsEditing(true);
  };

  const handleSubmitChanges = async () => {
    if (title.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    if (title.trim() === '') {
      await onDelete(todo.id);
      return;
    }

    try {
      await onEditTodo(todo.id, { fields: { title: title.trim() } });
      setIsEditing(false);
    } catch {
      titleInputRef.current?.focus();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitChanges();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          aria-label={`Mark todo "${todo.title}" as completed`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading(todo.id)}
          onChange={() =>
            onEditTodo(todo.id, { fields: { completed: !todo.completed } })
          }
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleInputRef}
            name="title"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSubmitChanges}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleToggleSetEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
