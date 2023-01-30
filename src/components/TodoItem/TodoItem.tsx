import cn from 'classnames';
import {
  FC, FocusEvent, FormEvent, memo, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import './TodoItem.scss';

type Props = {
  todo: Todo
  onDelete: (id: number) => unknown
  isProcessing?: boolean
  onUpdate: (changedTodo: Todo) => unknown
};

export const TodoItem: FC<Props> = memo(({
  todo, onDelete, isProcessing, onUpdate,
}) => {
  const { id, title, completed } = todo;
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleStatusChange = () => {
    onUpdate({
      ...todo,
      completed: !completed,
    });
  };

  const handleTitleChange = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    const trimmedTempTitle = tempTitle.trim();

    if (trimmedTempTitle === title) {
      setTempTitle(trimmedTempTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTempTitle) {
      onUpdate({
        ...todo,
        title: trimmedTempTitle,
      });
    } else {
      onDelete(id);
    }

    setTempTitle(trimmedTempTitle);
    setIsEditing(false);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing === true) {
      todoTitleField.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleStatusChange}
          checked={completed}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTitleChange}>
            <input
              data-cy="TodoTitleField"
              ref={todoTitleField}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={tempTitle}
              onChange={(event) => setTempTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeydown}
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
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
