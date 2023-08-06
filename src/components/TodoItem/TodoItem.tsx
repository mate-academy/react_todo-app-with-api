import classNames from 'classnames';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete: (todoDelte: Todo) => void;
  onCompleteUpdate: (todoId: number, completed: boolean) => void;
  onTitleUpdate: (todoId: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  onDelete,
  onCompleteUpdate,
  onTitleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isCompleted = todo.completed === true;

  const isLoading = loadingTodoIds.includes(todo.id);

  const handleDeleteTodo = useCallback(() => {
    onDelete(todo);
  }, []);

  const handleCompleteUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    onCompleteUpdate(todo.id, event.target.checked);
  };

  const handleTitleUpdate = useCallback((
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onTitleUpdate(todo.id, newTitle);
    setIsEditing(false);
  }, [newTitle, todo.id]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>
  | FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    onTitleUpdate(todo.id, newTitle);
    setIsEditing(false);

    if (!newTitle.trim()) {
      handleDeleteTodo();
    }
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle('');
    }
  };

  return (
    <div
      className={classNames('todo', { completed: isCompleted })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCompleteUpdate}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTitleUpdate}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onBlur={handleFormSubmit}
              onKeyUp={handleCancel}
              onChange={event => setNewTitle(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
              disabled={isLoading}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
