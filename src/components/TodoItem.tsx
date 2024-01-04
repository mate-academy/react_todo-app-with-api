import { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  togCheck: (todo: Todo) => void;
  handleUpdate: (todo: Todo) => void;
  loading: boolean; //
  handleDeletedTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  togCheck,
  handleUpdate,
  loading,
  handleDeletedTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  };

  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editValue.trim()) {
      handleDeletedTodo(todo.id);

      return;
    }

    if (todo.title === editValue) {
      setIsEditing(false);

      return;
    }

    handleUpdate({
      ...todo,
      title: editValue,
    });

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => togCheck(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={handleBlur}
            value={editValue}
            onChange={handleInputChange}
            ref={inputRef}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeletedTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={loading ? 'modal overlay is-active' : 'modal overlay'}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
