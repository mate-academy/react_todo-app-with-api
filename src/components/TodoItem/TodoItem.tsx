import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  editingTodoId?: number | null;
  setEditingTodoId?: (value: number | null) => void;
  onDelete?: (id: number) => void;
  isProcessings?: number[],
  onUpdate?: (todoId: number, args: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, id, title },
  editingTodoId = null,
  setEditingTodoId = () => {},
  onDelete = () => {},
  isProcessings = [],
  onUpdate = () => {},
}) => {
  const [newTitle, setNewTitle] = useState<string>(title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [editingTodoId]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleCanceling = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setNewTitle(title);
    }
  };

  const handleCheckboxChange = () => onUpdate(id, { completed: !completed });

  const saveChanges = () => {
    setEditingTodoId(null);
    switch (true) {
      case newTitle === '':
        onDelete(id);
        break;
      case newTitle !== title:
        onUpdate(id, { title: newTitle });
        break;
      default:
        break;
    }
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setEditingTodoId(null);
    saveChanges();
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {editingTodoId === id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={saveChanges}
            onKeyUp={handleCanceling}
            ref={titleField}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(id)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': !id || isProcessings.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
