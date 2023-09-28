import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isSubmitting?: boolean;
  onDelete?: () => void;
  deletingIds: number[];
  onTodoRename?: (todoTitle: string) => void;
  onRenameMessage?: (err: string) => void;
  toggleTodo?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmitting,
  onDelete = () => {},
  deletingIds,
  onTodoRename = () => {},
  onRenameMessage = () => {},
  toggleTodo = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title.trim());

  const { completed, title } = todo;

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === todoTitle) {
      setIsEditing(false);

      return;
    }

    try {
      if (todoTitle.trim()) {
        await onTodoRename(todoTitle.trim());
      } else {
        await onDelete();
      }

      setIsEditing(false);
    } catch (error) {
      onRenameMessage('Unable to rename todo');
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const onKeyUpHandle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isSubmitting || deletingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={completed}
          onClick={toggleTodo}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              ref={titleInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={onKeyUpHandle}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}
    </div>
  );
};
