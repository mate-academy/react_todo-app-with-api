import { Todo } from '../../types/Todo';
import cls from 'classnames';
import React, { useState } from 'react';
import { TodoLoader } from '../TodoLoader/TodoLoader';

export interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  deleteTodo?: (todoId: number) => void;
  onUpdateTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, onSuccess?: VoidFunction) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  deleteTodo,
  onUpdateTodo,
  updateTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const onSuccess = () => {
    setIsEditing(false);
  };

  const handleUpdate = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    if (trimmedTitle) {
      updateTodoTitle({ ...todo, title: trimmedTitle }, onSuccess);
    } else {
      deleteTodo?.(todo.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cls('todo', { completed: todo.completed })}>
      {isLoading && <TodoLoader />}

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onUpdateTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            value={title}
            className="todo__title-field"
            onChange={e => setTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            placeholder="Empty todo will be deleted"
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo?.(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cls('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
