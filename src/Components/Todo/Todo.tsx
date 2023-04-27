import classNames from 'classnames';
import { useState } from 'react';
import { TodoInterface } from '../../types/Todo';

type Props = {
  todo: TodoInterface;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<TodoInterface>) => void;
  isLoading: boolean;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isLoading,
}) => {
  const { completed, title, id } = todo;

  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleTitleSubmit = () => {
    if (todoTitle.trim() === '') {
      onDelete(id);
    } else {
      setIsEditing(false);
      onUpdate(id, { title: todoTitle });
    }
  };

  const handleTitleCancel = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      handleTitleCancel();
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !completed })}
        />
      </label>
      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          value={todoTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="todo__title" onDoubleClick={handleDoubleClick}>
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
