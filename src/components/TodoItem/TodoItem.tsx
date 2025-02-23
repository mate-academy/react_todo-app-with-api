import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  idsForDelete?: number[];
  idsForUpdate?: number[];
  setIdsForDelete: (prevIds: (ids: number[]) => number[]) => void;
  setIdsForUpdate: (prevIds: (ids: number[]) => number[]) => void;
  setNewTodoData: (newTodoData: Partial<Todo>) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  idsForDelete,
  idsForUpdate,
  setIdsForDelete,
  setIdsForUpdate,
  setNewTodoData,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const { id, title, completed } = todo;

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value.trimStart());
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleDelete = useCallback(() => {
    setIdsForDelete(currentIds => [...currentIds, id]);
  }, [id, setIdsForDelete]);

  const handleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoData({
      completed: event.target.checked,
      title: newTitle.trim(),
    });
    setIdsForUpdate(currentIds => [...currentIds, id]);
  };

  const handleTitleSave = useCallback(() => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleDelete();

      return;
    }

    setNewTodoData({ title: trimmedTitle });
    setIdsForUpdate(currentIds => [...currentIds, id]);
    setIsEditing(false);
  }, [id, newTitle, setNewTodoData, handleDelete, setIdsForUpdate]);

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(title);
      } else if (event.key === 'Enter') {
        handleTitleSave();
      }
    },
    [title, handleTitleSave],
  );

  const isLoaderShow =
    !id || idsForDelete?.includes(id) || idsForUpdate?.includes(id);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditing, handleKeyUp]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handleUpdate}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoaderShow,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
