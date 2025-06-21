import { Todo } from '../types/typedefs';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

interface TodoCardProps {
  todo: Todo;
  loadingTodo: number | 'initial' | null;
  onToggle: (todoId: number) => Promise<void>;
  onRemove: (todoId: number) => Promise<void>;
  onUpdateTitle: (todoId: number, newTitle: string) => Promise<void>;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  loadingTodo,
  onToggle,
  onRemove,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const isLoadingThisTodo = loadingTodo === todo.id;
  const isTemp = todo.id === 0;

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const handleDoubleClick = () => {
    if (!isLoadingThisTodo && !isTemp) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await onUpdateTitle(todo.id, editTitle);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const handleEditBlur = () => {
    handleSave();
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'item-enter-done': !isTemp && !isLoadingThisTodo,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label="todostatus-label"
          disabled={isLoadingThisTodo || isTemp}
        />
      </label>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTemp || isLoadingThisTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleEditBlur}
            onKeyUp={handleEditKeyUp}
            disabled={isLoadingThisTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemove(todo.id)}
            disabled={isLoadingThisTodo || isTemp}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
