import React, { useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  loadingTodoIds: number[],
  updateTask?: (todo: Todo) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loadingTodoIds,
  updateTask = () => {},
}) => {
  const {
    id,
    title,
    completed,
    userId,
  } = todo;

  const [isEdit, setIsEdit] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const focusTitle = useRef(null);

  const handleCheked = useCallback(() => {
    updateTask({
      id,
      userId,
      title,
      completed: !completed,
    });
  }, [loadingTodoIds]);

  const handleDoubleCheked = useCallback(() => {
    setIsEdit(true);
  }, [isEdit]);

  const handleKeyboard = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!currentTitle.trim()) {
        onDelete(id);
        setIsEdit(false);
      } else if (currentTitle.trim() === title) {
        setIsEdit(false);
      } else {
        updateTask({
          id,
          userId,
          title: currentTitle.trim(),
          completed,
        });
        setIsEdit(false);
      }
    }

    if (event.key === 'Escape') {
      setIsEdit(false);
      setCurrentTitle(title);
    }
  }, [currentTitle, title, isEdit]);

  const handleLoseFocus = useCallback(() => {
    if (!currentTitle.trim()) {
      onDelete(id);
      setIsEdit(false);
    } else if (currentTitle.trim() === title) {
      setIsEdit(false);
    } else {
      setIsEdit(false);
      updateTask({
        id,
        userId,
        title: currentTitle.trim(),
        completed,
      });
    }
  }, [currentTitle, isEdit]);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleCheked}
        />
      </label>

      {isEdit ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={focusTitle}
            value={currentTitle}
            onChange={event => setCurrentTitle(event.target.value)}
            onKeyDown={handleKeyboard}
            onBlur={handleLoseFocus}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={handleDoubleCheked}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loadingTodoIds.length && loadingTodoIds.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
