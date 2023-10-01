import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onTodoDelete?: () => void;
  onRenameTodo?: (todoTitle: string) => void;
  onTodoToggle?: () => Promise<void>;
  isProcessing: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete = () => { },
  onRenameTodo = () => { },
  onTodoToggle = () => { },
  isProcessing,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const trimmedTitle = todoTitle.trim();

      if (!trimmedTitle) {
        setIsEditing(false);
        await onTodoDelete();

        return;
      }

      if (todo.title === trimmedTitle) {
        setIsEditing(false);

        return;
      }

      if (trimmedTitle) {
        await onRenameTodo(todoTitle);
        setIsEditing(false);
      } else {
        await onTodoDelete();
      }

      setIsEditing(false);
    } catch {
      throw new Error();
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current?.focus();
    }
  }, [isEditing, isProcessing]);

  const onKeyUpHandle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onTodoToggle}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              onKeyUp={onKeyUpHandle}
              ref={titleInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title.trim()}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onTodoDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
