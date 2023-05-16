import { memo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodoId?: number;
  onDelete?: (todoId: number) => void;
  onCompletedChange?: (todoId: number, completed: boolean) => Promise<void>;
  onTitleChange?: (todoId: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  tempTodoId = 0,
  onDelete = () => {},
  onCompletedChange = () => {},
  onTitleChange = () => {},
}) => {
  const defaultLoadingValue = tempTodoId === todo.id;
  const [isLoading, setIsLoading] = useState(defaultLoadingValue);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { title, completed } = todo;

  useEffect(() => {
    return () => {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(defaultLoadingValue);
      }, 300);
    };
  }, [todo.completed, todo.title]);

  const handleCompletedChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onCompletedChange(todo.id, event.target.checked);
  };

  const handleRemove = async () => {
    setIsLoading(true);

    await onDelete(todo.id);

    setIsLoading(false);
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

  return (
    <div className={classNames('todo', {
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
              onClick={handleRemove}
              disabled={todo.id === tempTodoId}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
