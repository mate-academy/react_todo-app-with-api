import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  renameTodo: (
    id: number,
    newTitle: string,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => void;
  isLoading: boolean | undefined;
}

export const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  renameTodo,
  isLoading,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing || isError) {
      inputRef.current?.focus();
    }
  }, [isEditing, isError]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return setIsEditing(false);
    }

    if (!trimmedTitle) {
      return deleteTodo(todo.id);
    }

    try {
      await renameTodo(todo.id, trimmedTitle, inputRef);
      setIsEditing(false);
      setIsError(false);
    } catch {
      setIsError(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }

    if (event.key === 'Enter' && !isError) {
      handleBlur();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        'is-editing': isEditing,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="visually-hidden">Mark as done</span>
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          value={newTitle}
          data-cy="TodoTitleField"
          placeholder="Empty todo will be deleted"
          onBlur={handleBlur}
          onChange={e => setNewTitle(e.target.value)}
          onKeyUp={handleKeyUp}
          autoFocus
          ref={inputRef}
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
