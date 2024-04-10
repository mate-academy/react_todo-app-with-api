/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { handleError } from '../components/Error';

interface Props {
  todo: Todo;
  onDeleteTodo?: (id: number) => void;
  onUpdateTodo: (patchTodo: Todo, title: string) => Promise<void>;
  setLoading: (loading: string | number | null) => void;
  setErrorMessage: (message: string) => void;
  loadingTodoIds: number[];
}

const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  onUpdateTodo,
  setLoading,
  setErrorMessage,
  loadingTodoIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const saveEdit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: trimmedTitle,
    };

    setLoading(todo.id);

    try {
      await onUpdateTodo(updatedTodo, trimmedTitle);
    } catch (error) {
      handleError('Unable to update a todo', setErrorMessage);
      setIsEditing(true);
    } finally {
      setLoading(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editedTitle !== todo.title) {
        saveEdit();
      } else {
        setIsEditing(false);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    saveEdit();
    setIsEditing(false);
  };

  const handleStatusChange = () => {
    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    onUpdateTodo(updatedTodo, todo.title);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`TodoStatus-${todo.id}`}>
        <input
          id={`TodoStatus-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditing ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className={cn('todo__title', { hidden: isEditing })}
          onDoubleClick={handleEditToggle}
        >
          {todo.title}
        </span>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': !todo.id || loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {!isEditing && !!todo.id && (
        <button
          type="button"
          className={cn('todo__remove')}
          data-cy="TodoDelete"
          onClick={() => {
            onDeleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TodoItem;
