import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => Promise<void>;
  onUpdate?: (todoId: number, data: Partial<Todo>) => Promise<void>;
  onError?: (message: string) => void;
  isProcessed?: boolean;
  editTodoFieldRef: React.RefObject<HTMLInputElement>;
  focusEditTodoField?: () => void;
  handleEditTodo?: (todoId: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  onError,
  isProcessed = false,
  editTodoFieldRef,
  focusEditTodoField,
  handleEditTodo,
}) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const handleCheckboxChange = () => {
    onUpdate?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditingMode(true);

    if (editTodoFieldRef.current) {
      editTodoFieldRef.current.focus();
    } else if (focusEditTodoField) {
      focusEditTodoField();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleDelete = async () => {
    if (!isLoadingState) {
      setIsLoadingState(true);
      try {
        await onDelete?.(todo.id);
      } finally {
        setIsLoadingState(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (editedTitle.trim() === '') {
      onError?.('Title should not be empty');
      setEditedTitle(todo.title);
      editTodoFieldRef.current?.focus();

      return;
    }

    if (!isLoadingState) {
      setIsLoadingState(true);
      try {
        await onUpdate?.(todo.id, { title: editedTitle.trim() });
        setIsEditingMode(false);
      } catch {
        onError?.('Unable to update a todo');
        setEditedTitle(todo.title);
      } finally {
        setIsLoadingState(false);
      }
    }
  };

  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (editedTitle.trim() === '') {
        await handleDelete();
      } else if (editedTitle.trim() !== todo.title) {
        await handleUpdate();
        handleEditTodo?.(todo.id, editedTitle);
        editTodoFieldRef.current?.blur();
      } else {
        setIsEditingMode(false);
      }
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditingMode(false);
    }
  };

  const handleBlur = async () => {
    if (editedTitle.trim() !== todo.title) {
      if (editedTitle.trim() === '') {
        await handleDelete();
      } else {
        await handleUpdate();
      }
    } else {
      setIsEditingMode(false);
    }
  };

  useEffect(() => {
    if (isEditingMode) {
      editTodoFieldRef.current?.focus();
    } else {
      editTodoFieldRef.current?.blur();
    }
  }, [isEditingMode, editTodoFieldRef]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed || isLoadingState}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditingMode ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          ref={editTodoFieldRef}
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditingMode && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isProcessed || isLoadingState}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed || isLoadingState,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
