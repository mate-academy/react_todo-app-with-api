import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => void,
  isProcessing?: boolean,
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
    const [isEdited, setEdit] = useState(false);
    const [tempTitle, setTempTitle] = useState(todo.title);
    const inputElement = useRef<HTMLInputElement>(null);
    const hasChanges = tempTitle !== todo.title;

    useEffect(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, [isEdited]);

    const saveChanges = () => {
      setEdit(false);
      if (hasChanges) {
        if (!tempTitle) {
          onDelete(todo.id);

          return;
        }

        onChangeTitle(todo.id, tempTitle);
      }
    };

    const cancelChanges = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEdit(false);
      }
    };

    return (
      <div
        key={todo.id}
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={(event) => updateTodo([todo.id], event.target.checked)}
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
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => onDelete(todo.id)}
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
