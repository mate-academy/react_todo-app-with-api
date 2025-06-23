import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  onDeleteTodo?: (todo: Todo) => Promise<void>;
  isLoading: boolean;
  onUpdateTodo?: (todoFromInput: Todo) => Promise<Todo>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteTodo: handleDeleteTodo = async () => {},
  isLoading,
  onUpdateTodo: handleUpdateTodo = async () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleChangeStatusTodo = (todoFromInput: Todo) => {
    const toUpdateTodo = { ...todoFromInput };

    toUpdateTodo.completed = !toUpdateTodo.completed;

    handleUpdateTodo(toUpdateTodo);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    if (newTitle.trim() === '') {
      handleDeleteTodo(todo).catch(() => {
        setIsEditing(true);
      });

      return;
    }

    const toUpdateTodo = { ...todo };

    toUpdateTodo.title = newTitle.trim();

    handleUpdateTodo(toUpdateTodo).then(() => {
      setIsEditing(false);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveEdit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { 'todo completed': todo.completed })}
      onDoubleClick={() => {
        handleDoubleClick();
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeStatusTodo(todo)}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            autoFocus
            onBlur={saveEdit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
