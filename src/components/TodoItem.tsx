import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  pendingIds: number[];
  updateText: (todos: Todo[]) => Promise<boolean>[];
  toggleTodo: (todos: Todo[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  handleDeleteTodo,
  isLoading,
  pendingIds,
  updateText,
  toggleTodo,
}) => {
  const todo: Todo = { id, title, completed: completed, userId: id };
  const [editedValue, setEditedValue] = useState<string>(title);
  const [hasEditFocus, setHasEditFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [hasEditFocus]);

  const handleSave = () => {
    const preparedValue = editedValue.trim();

    if (!preparedValue) {
      handleDeleteTodo([id]);

      return;
    }

    if (title === preparedValue) {
      setEditedValue(preparedValue);
      setHasEditFocus(false);

      return;
    }

    setHasEditFocus(false);
    setEditedValue(preparedValue);

    const updatedTodo = {
      id: todo.id,
      userId: todo.userId,
      title: preparedValue,
      completed: todo.completed,
    };

    updateText([updatedTodo]).forEach(promise => {
      promise.then(response => {
        if (!response) {
          setHasEditFocus(true);
        }
      });
    });

    setHasEditFocus(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      setHasEditFocus(false);
      setEditedValue(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        'item-enter-done': true,
        completed,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle Todo Status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo([todo])}
        />
      </label>

      {hasEditFocus ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedValue}
          onChange={event => {
            setEditedValue(event.target.value);
          }}
          onKeyUp={handleKeyDown}
          onBlur={handleSave}
          ref={inputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setHasEditFocus(true);
            }}
          >
            {editedValue}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo([id])}
            aria-label="Delete Todo"
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || pendingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
