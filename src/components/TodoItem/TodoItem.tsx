import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isLoading: boolean;
  onToggleStatusSingleTodo: (
    todoId: number,
    completed: boolean,
  ) => Promise<void>;
  onUpdateTodo: (todoId: number, title: string) => Promise<void>;
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  isLoading,
  onToggleStatusSingleTodo,
  onUpdateTodo,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value.trimStart());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onUpdateTodo(todo.id, trimmedTitle);
      setIsEditing(false);
    } catch (error) {
      setIsEditing(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onToggleStatusSingleTodo(todo.id, !todo.completed);
          }}
          disabled={isLoading}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
