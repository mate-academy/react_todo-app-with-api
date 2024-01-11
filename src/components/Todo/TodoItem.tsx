import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onRemove: (todoId: number) => void;
  onToggle: (todoId: number) => void;
  onEdit: (todoId: number, newTitle: string) => void;
  processingTodoIds: number[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  onToggle,
  onEdit,
  processingTodoIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (editTitle.trim() === '') {
      onRemove(todo.id);
    } else {
      onEdit(todo.id, editTitle);
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const isTodoProcessing = processingTodoIds?.includes(todo.id);

  return (
    <div>
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
            onClick={() => onToggle(todo.id)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={handleEditChange}
              onBlur={handleEditSubmit}
            />
          </form>
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
        )}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onRemove(todo.id)}
        >
          ×
        </button>

        {isTodoProcessing && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </div>
  );
};
