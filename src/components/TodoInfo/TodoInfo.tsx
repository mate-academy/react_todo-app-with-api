import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import './TodoInfo.scss';

interface TodoInfoProps {
  todo: Todo;
  onRemoveTodo: (id: number) => void;
  onUpdateTodo: (todoId: number, updatedValue: string | boolean) => void;
  loadingTodoIds: number[];
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  todo,
  onRemoveTodo,
  onUpdateTodo,
  loadingTodoIds,
}) => {
  const { id, title, completed } = todo;

  const [completedStatus, setCompletedStatus] = useState(completed);
  const [isActiveEditForm, setIsActiveEditForm] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActiveEditForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActiveEditForm]);

  const updateTitle = useCallback(() => {
    const formattedTitle = currentTitle
      .replace(/\s{2,}/, ' ')
      .trim();

    if (formattedTitle === title) {
      setIsActiveEditForm(false);

      return;
    }

    if (!formattedTitle) {
      onRemoveTodo(id);

      return;
    }

    onUpdateTodo(id, formattedTitle);

    setCurrentTitle(title);
  }, [currentTitle]);

  const handleStatusChange = () => {
    const updatedCompletedStatus = !completed;

    setCompletedStatus(updatedCompletedStatus);

    onUpdateTodo(id, updatedCompletedStatus);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(event.target.value);
  };

  const handleRemoveClick = () => {
    onRemoveTodo(id);
  };

  const handleDoubleClick = () => {
    const updatedStatus = !isActiveEditForm;

    setIsActiveEditForm(updatedStatus);
  };

  const handleKeyTouch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setCurrentTitle(title);
      setIsActiveEditForm(false);
    }
  };

  const handleLoseFocus = () => {
    setIsActiveEditForm(false);

    updateTitle();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completedStatus}
          onChange={handleStatusChange}
        />
      </label>
      {isActiveEditForm
        ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleLoseFocus}
          >
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              value={currentTitle}
              onChange={handleTitleChange}
              onKeyUp={handleKeyTouch}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {currentTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveClick}
            >
              x
            </button>
          </>
        )}

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': loadingTodoIds.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
