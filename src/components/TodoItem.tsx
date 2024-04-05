import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todo: Todo;
  onDeleteTodo?: (todoId: number) => void;
  onUpdateTodos?: (newTodo: Todo) => void;
  deletedTodoIds?: number[];
  onError?: (error: Errors) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  onError = () => {},
  deletedTodoIds,
  onUpdateTodos,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputField = useRef<HTMLInputElement | null>(null);

  const isIncludesId = deletedTodoIds?.includes(todo.id);

  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus();
    }
  }, [isEditing]);

  const handleToggleComplet = async (value: boolean) => {
    try {
      setIsLoading(true);

      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: value,
      });

      if (onUpdateTodos) {
        onUpdateTodos(updatedTodo as Todo);
      }
    } catch {
      onError(Errors.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const renameTodo = async () => {
    try {
      setIsLoading(true);
      setIsEditing(true);

      const newTitle = editTitle.trim();

      if (newTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      if (!editTitle) {
        onDeleteTodo(todo.id);

        return;
      }

      const newTodo = await updateTodo(todo.id, {
        ...todo,
        title: newTitle,
      });

      if (onUpdateTodos) {
        setIsEditing(false);
        onUpdateTodos(newTodo as Todo);
      }
    } catch {
      onError(Errors.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTodo = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    renameTodo();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    renameTodo();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="todo-status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e => handleToggleComplet(e.target.checked)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditTodo}
          >
            {todo.title}
          </span>

          <button
            onClick={() => onDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isIncludesId || todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
