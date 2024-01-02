import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  selectedTodoId: number;
  setSelectedTodoId: (id: number) => void;
  onDelete: (id: number) => void;
  loadingTodosIds: number [];
  toggleTodoStatus: (id: number) => void;
  updateTodoTitle: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodoId,
  setSelectedTodoId,
  onDelete,
  loadingTodosIds,
  toggleTodoStatus,
  updateTodoTitle,
}) => {
  const {
    id,
    title,
    completed,
    userId,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);

  const isTodoLoading = loadingTodosIds.includes(id);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => inputRef.current?.focus(), [selectedTodoId]);

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newTitle.trim() !== title) {
      if (!newTitle.trim()) {
        onDelete(id);
      } else {
        updateTodoTitle({
          id,
          title: newTitle.trim(),
          completed,
          userId,
        });

        if (title === newTitle.trim()) {
          inputRef.current?.blur();
        }
      }
    } else {
      inputRef.current?.blur();
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setSelectedTodoId(0);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={() => setSelectedTodoId(id)}
      onBlur={(event) => {
        setSelectedTodoId(0);
        handleFormSubmit(event);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => toggleTodoStatus(id)}
        />
      </label>

      {id === selectedTodoId
        ? (
          <form
            onSubmit={handleFormSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyUp={handleKeyUp}
              ref={inputRef}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isTodoLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
