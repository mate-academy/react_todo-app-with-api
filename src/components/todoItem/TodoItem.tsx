/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useRef, useState, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../context/context';
import { updateTodoOnClick } from '../../helpers/updateTodoOnClick';

interface Props {
  todo: Todo;
  isEditing?: boolean;
  onEdit?: (id: number) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const {
    setTodoLoading,
    setErrorMessage,
    setTodos,
    todoLoadingStates,
    handleDelete,
  } = useTodosContext();

  const { id, completed, title } = todo;
  const [editValue, setEditValue] = useState(title);
  const [initialTitle, setInitialTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedValue = editValue.trim();

  const handleSelectInputChange = async () => {
    await updateTodoOnClick({
      keyValue: 'completed',
      setErrorMessage,
      setTodoLoading,
      setTodos,
      id,
      newData: !completed,
    });
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editValue === initialTitle) {
        onCancel?.();

        return;
      }

      await updateTodoOnClick({
        keyValue: 'title',
        newData: trimmedValue,
        onSave,
        setErrorMessage,
        setTodos,
        setTodoLoading,
        id,
      });
    } else if (e.key === 'Escape') {
      setEditValue(initialTitle);
      onCancel?.();
    }
  };

  const handleBlur = async () => {
    if (editValue !== title) {
      await updateTodoOnClick({
        keyValue: 'title',
        newData: trimmedValue,
        onSave,
        setErrorMessage,
        setTodos,
        setTodoLoading,
        id,
      });
    } else {
      onCancel?.();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }

    setInitialTitle(title);
  }, [isEditing, title]);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleSelectInputChange}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEdit?.(id)}
        >
          {title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
