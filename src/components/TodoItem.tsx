import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  loadingIds: number[];
  handleSwitchTodo: (todos: Todo[]) => void;
  updateTitleName: (todosDataUpdate: Todo[]) => Promise<boolean>[];
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
  const [hasEditTitleFocus, setHasEditTitleFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [hasEditTitleFocus]);

  const handleSave = () => {
    const trimmedTitle = editValue.trim();

    if (!trimmedTitle) {
      handleDeleteTodo([id]);

      return;
    }

    if (title === trimmedTitle) {
      setEditValue(trimmedTitle);
      setHasEditTitleFocus(false);

      return;
    }

    setHasEditTitleFocus(false);
    setEditValue(trimmedTitle);

    const updatedTodo = {
      id: todo.id,
      userId: todo.userId,
      title: trimmedTitle,
      completed: todo.completed,
    };

    updateTitleName([updatedTodo]).forEach(promise => {
      promise.then(response => {
        if (!response) {
          setHasEditTitleFocus(true);
        }
      });
    });

    setHasEditTitleFocus(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      setHasEditTitleFocus(false);
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

      {hasEditTitleFocus ? (
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
          ref={inputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setHasEditTitleFocus(true);
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
