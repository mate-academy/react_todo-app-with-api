import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoRowProps = {
  todo: Todo,
  onTodoDelete?: () => Promise<void>,
  onTodoRename?: (todoTitle: string) => Promise<void>,
  isProcessing: boolean,
  toggleTodo?: () => void,
  onTodoRenameError?: (errorMessage: string) => void,
};

export const TodoRow: React.FC<TodoRowProps> = ({
  todo,
  onTodoDelete = () => { },
  onTodoRename = () => { },
  isProcessing,
  toggleTodo,
  onTodoRenameError = () => { },
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title.trim());

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === todoTitle) {
      setIsEditing(false);

      return;
    }

    try {
      if (todoTitle.trim()) {
        await onTodoRename(todoTitle.trim());
      } else {
        await onTodoDelete();
      }

      setIsEditing(false);
    } catch (error) {
      onTodoRenameError('Unable to rename todo');
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const onKeyUpHandle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={toggleTodo}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              ref={titleInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={onKeyUpHandle}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todo.title}
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
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
