import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete: (todoId: number) => void,
  onTodoUpdate: (todoTitle: string) => Promise<void>,
  isLoading: boolean,
  onChangeBox: (todo: Todo) => void,
};

export const TodoAppRow: React.FC<Props> = ({
  todo,
  onTodoDelete,
  onTodoUpdate,
  isLoading,
  onChangeBox,
}) => {
  const {
    title,
    completed,
  } = todo;
  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const titleInput = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const SavwTodo = async () => {
    if (todoTitle !== title) {
      try {
        await onTodoUpdate(todoTitle);
        setIsEditing(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (!todoTitle.trim()) {
      await onTodoDelete(todo.id);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
      SavwTodo();
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
    titleInput.current?.focus();
    SavwTodo();
    console.log('renfer');
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleEditingCancel = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChangeBox(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleFormSubmit}
        >
          <input
            onBlur={handleBlur}
            ref={titleInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleChange}
            onKeyUp={handleEditingCancel}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
          >
            {todoTitle.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onTodoDelete(todo.id);
            }}

          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
