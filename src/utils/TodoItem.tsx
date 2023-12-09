import classNames from 'classnames';
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDoubleClick?: () => void;
  onClick?: (id: number) => void;
  isLoading: boolean,
  handleToggleComplete?: (id: number) => void;
  isEditing?: boolean;
  finishEditing?: () => void;
  handleTodoTitleChange?: (todoId: number,
    updatedData: string, currentTitle: string) => void;
}

export const TodoItem: FC<TodoItemProps> = (
  {
    todo,
    onDoubleClick,
    onClick,
    isLoading,
    handleToggleComplete,
    isEditing,
    finishEditing,
    handleTodoTitleChange,
  },
) => {
  const [editedTitle, setEditedTitle] = useState(todo?.title || '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTodoTitleChange?.(todo.id, editedTitle, todo.title);
  };

  const onClickHandler = () => {
    onClick?.(todo.id);
  };

  const handleToggleCompleteHandler = () => {
    handleToggleComplete?.(todo.id);
  };

  const handleBlur = () => {
    handleTodoTitleChange?.(todo.id, editedTitle, todo.title);
    finishEditing?.();
  };

  const handleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle('');
      finishEditing?.();
    }
  };

  return (

    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={onDoubleClick}

    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleCompleteHandler}
        />
      </label>
      { isEditing
        ? (
          <>
            <form
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                onChange={handleEditing}
                value={editedTitle}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onBlur={handleBlur}
                onKeyUp={cancelEditing}
              />
            </form>

          </>
        )
        : (
          <>
            <span
              className="todo__title"
            >
              {editedTitle || todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={onClickHandler}
            >
              ×

            </button>
          </>
        )}

      {isLoading
        && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};
