import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => void,
  isProcessing: boolean,
  updateTodo: (todoId: number[], data: boolean) => void,
  onChangeTitle: (id: number, title: string) => void,
}

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    onDelete,
    isProcessing,
    updateTodo,
    onChangeTitle,
  }) => {
    const { title, id, completed } = todo;

    const [isEdited, setEdit] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const inputElement = useRef<HTMLInputElement>(null);
    const hasChanges = tempTitle !== title;

    useEffect(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, [isEdited]);

    const saveChanges = () => {
      setEdit(false);
      if (hasChanges) {
        if (!tempTitle.trim()) {
          onDelete(id);

          return;
        }

        onChangeTitle(id, tempTitle);
      }
    };

    const cancelChanges = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEdit(false);
      }
    };

    return (
      <div
        key={id}
        className={classNames(
          'todo',
          { completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={(event) => updateTodo([id], event.target.checked)}
          />
        </label>
        {isEdited ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveChanges();
            }}
          >
            <input
              ref={inputElement}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={tempTitle}
              onKeyUp={(event) => cancelChanges(event)}
              onBlur={() => saveChanges()}
              onChange={({ target }) => setTempTitle(target.value)}
            />
          </form>
        )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => setEdit(true)}
              >
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => onDelete(id)}
              >
                ×
              </button>

            </>
          )}

        <div
          className={classNames(
            'modal overlay',
            { 'is-active': isProcessing },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
