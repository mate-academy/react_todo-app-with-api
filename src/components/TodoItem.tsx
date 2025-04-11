import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onToggle: (todoId: number) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todoId: number, title: string) => Promise<void>;
  isDeleting?: boolean;
  isToggling?: boolean | null;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  deleteTodo,
  updateTodo,
  isDeleting = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      setIsLoading(true);
      try {
        await deleteTodo(todo.id);
      } catch {
        alert('Unable to delete the todo.');
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);
    try {
      await updateTodo(todo.id, trimmedTitle);
      setIsEditing(false);
    } catch {
      alert('Unable to update the todo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
        'todo--loading': isLoading,
      })}
      data-cy="Todo"
    >
      <label
        htmlFor={`todo-checkbox-${todo.id}`}
        className="todo__status-label"
        aria-labelledby={`todo-checkbox-${todo.id}`}
      >
        <input
          id={`todo-checkbox-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading || isDeleting}
          data-cy="TodoStatus"
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label htmlFor={`todo-edit-${todo.id}`} className="todo__title-label">
            Edit Todo
          </label>
          <input
            id={`todo-edit-${todo.id}`}
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
            autoFocus
            placeholder="Empty todo will delete"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
            data-cy="TodoTitle"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
            disabled={isDeleting}
            data-cy="TodoDelete"
          >
            {isDeleting ? 'Deleting...' : '×'}
          </button>
        </>
      )}
      {(isLoading || isDeleting) && (
        <span className="todo__loader">Saving...</span>
      )}
    </div>
  );
};

export default TodoItem;
