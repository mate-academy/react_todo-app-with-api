import { Todo } from '../../types/Todo';
import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed: boolean,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDeleteTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  const saveEditedTodo = async () => {
    if (todo.title === todoTitle) {
      setIsEditing(false);

      return;
    }

    if (todoTitle.trim().length === 0) {
      try {
        await handleDeleteTodo(todo.id);
        setIsEditing(false);
      } catch {
        setIsEditing(true);
      }

      return;
    }

    try {
      await updateTodo(todo.id, todoTitle.trim(), todo.completed);
      setIsEditing(false);
    } catch {
      setIsEditing(true);
    }
  };

  const escapeEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveEditedTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <label className="todo__status-label">
          <input
            aria-label="Toggle todo"
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => updateTodo(todo.id, todo.title, !todo.completed)}
          />
        </label>
      </label>
      {isEditing ? (
        <form onSubmit={event => handleEditSubmit(event)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            onBlur={saveEditedTodo}
            onKeyUp={event => escapeEditing(event)}
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
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
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
