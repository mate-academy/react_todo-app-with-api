import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorType } from '../App';

type Props = {
  todo: Todo;
  isTodoEditing?: boolean;
  selectedPostId?: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  handleTodoDelete: (v: number) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteAllPressed: boolean;
  isUpdating?: boolean;
  setIsUpdating?: React.Dispatch<React.SetStateAction<boolean>>;
  onTodoUpdate?: (updatedTodo: Todo) => void;
  setCurrentError?: React.Dispatch<React.SetStateAction<'' | ErrorType>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  // isTodoEditing,
  // selectedPostId,
  // setIsTodoEditing,
  setSelectedPostId,
  handleTodoDelete,
  isLoading,
  setIsLoading,
  isUpdating,
  setIsUpdating,
  onTodoUpdate,
  setCurrentError,
}) => {
  const { title, id, completed } = todo;
  const [targetTodoId, setTargetTodoId] = useState(0);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim();

    setIsLoading(true);
    setTargetTodoId(id);

    if (!trimmedTitle) {
      try {
        await handleTodoDelete(id);
        setIsEditing(false);
        setSelectedPostId(0);
      } catch {
        setCurrentError?.(ErrorType.UnableToDeleteTodo);
        setIsEditing(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (trimmedTitle === title) {
      setIsEditing(false);
      setSelectedPostId(0);
      setEditedTitle(title);
      setIsLoading(false);

      return;
    }

    try {
      const updated = await updateTodo(id, { title: trimmedTitle });

      onTodoUpdate?.(updated);
      setIsEditing(false);
      setSelectedPostId(0);
    } catch {
      setCurrentError?.(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompleted = async () => {
    if (isUpdating) {
      return;
    }

    setIsLoading?.(true);
    setIsUpdating?.(true);
    setTargetTodoId(id);

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        onTodoUpdate?.(updatedTodo);
      })
      .catch(() => {
        setCurrentError?.(ErrorType.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsLoading?.(false);
        setIsUpdating?.(false);
      });
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editedTitle.trim() === '') {
        setIsLoading(true);
        setTargetTodoId(id);

        // Зачекай на рендер (дати React час показати loader)
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      handleSave();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleBlur = () => {
    handleSave(); // Передаємо правильний тип події
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
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
          onChange={handleToggleCompleted}
          disabled={isUpdating}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={e => setEditedTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            value={editedTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleTodoDelete(todo.id);
              setTargetTodoId(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated LOADER*/}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading && todo.id === targetTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
