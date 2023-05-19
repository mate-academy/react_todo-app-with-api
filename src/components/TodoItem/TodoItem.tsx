import { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoToDeleteId: number) => void;
  loadingTodoIds: number[];
  onCompletedChange: (todoId: number, completed: boolean) => Promise<void>;
  onTitleChange: (todoId: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onDelete = () => {},
  loadingTodoIds,
  onCompletedChange,
  onTitleChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { title, completed } = todo;
  const isLoading = loadingTodoIds.includes(todo.id);

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle('');
    }
  };

  const handleEdit = async (oldTitle: string) => {
    setIsEditing(true);
    setNewTitle(oldTitle);
  };

  const handleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    onTitleChange(todo.id, newTitle);
    setIsEditing(false);
  };

  const handleCompletedChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onCompletedChange(todo.id, event.target.checked);
  };

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onBlur={handleFormSubmit}
              onKeyUp={handleCancel}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => handleEdit(todo.title)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
              disabled={isLoading}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
