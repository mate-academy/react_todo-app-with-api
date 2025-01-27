import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  loadingIds: number[];
  handleSwitchTodo: (todos: Todo[]) => void;
  updateTitleName: (todo: Todo, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isLoading,
  loadingIds,
  handleSwitchTodo,
  updateTitleName,
}) => {
  const { id, title, completed } = todo;
  const [editValue, setEditValue] = useState<string>(title);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const trimmedTitle = editValue.trim();

    if (!trimmedTitle) {
      handleDeleteTodo([id]);
      setIsEditing(false);

      return;
    }

    if (title === trimmedTitle) {
      setEditValue(trimmedTitle);
      setIsEditing(false);

      return;
    }

    setEditValue(trimmedTitle);

    try {
      updateTitleName(todo, trimmedTitle);
      setIsEditing(false);
    } catch (e) {
      inputElement.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditValue(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            handleSwitchTodo([todo]);
          }}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editValue}
          onChange={event => {
            setEditValue(event.target.value);
          }}
          onKeyUp={handleKeyDown}
          onBlur={handleSave}
          ref={inputElement}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setTimeout(() => inputElement.current?.focus(), 0);
            }}
          >
            {editValue}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteTodo([id]);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
