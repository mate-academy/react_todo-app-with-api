import { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { completeTodo } from '../../api/sendRequest';

type Props = {
  todo: Todo;
  isDeleting: (id: number) => void;
  isChanging: (todo: Todo) => void;
  areAllCompleted: boolean;
  areAllToogling: boolean;
  areAllRemoving: boolean;
};

export const TodoItem: FC<Props> = ({
  todo,
  isDeleting,
  isChanging,
  areAllCompleted,
  areAllToogling,
  areAllRemoving,
}) => {
  // #region STATES & VARIABLES
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  let isLoading = id === 0
    || isRemoving
    || isCompleting
    || (areAllToogling && (!completed || areAllCompleted))
    || (completed && areAllRemoving);
  // #endregion

  // #region HANDLERS
  const handleTodoChange = async () => {
    setIsCompleting(true);
    isLoading = true;

    try {
      const updatedTodo = {
        ...todo,
        completed: !completed,
      };

      await completeTodo(updatedTodo);
      isChanging(updatedTodo);
    } catch (error) {
      // setError(ErrorType.Update);
    } finally {
      setIsCompleting(false);
      isLoading = false;
    }
  };

  const handleTodoRemove = async () => {
    try {
      setIsRemoving(true);
      await isDeleting(id);
      setTimeout(() => setIsRemoving(false), 3000);
    } catch (error) {
      // setError(ErrorType.Delete);
    }
  };
  // #endregion

  // #region ✅ Editable title
  const handleTitleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedTitle(event.target.value);
    }, [],
  );

  const handleTitleBlur = useCallback(() => {
    if (editedTitle.trim() !== '') {
      const updatedTodo = {
        ...todo,
        title: editedTitle.trim(),
      };

      isChanging(updatedTodo);
    }

    setIsEditing(false);
  }, [editedTitle, todo, isChanging]);

  const handleTitleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleTitleBlur();
      } else if (event.key === 'Escape') {
        setEditedTitle(title);
        setIsEditing(false);
      }
    }, [handleTitleBlur, setEditedTitle, setIsEditing, title],
  );
  // #endregion

  // #region RENDER
  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoChange}
        />
      </label>

      <span
        className="todo__title"
        onDoubleClick={handleTitleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            className="todo__input"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        ) : (
          title
        )}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoRemove}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
// #endregion
