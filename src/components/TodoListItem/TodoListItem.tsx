import cl from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDeleteTodo: (todoId: number) => void;
  changeTodo: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
  changeTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (normalizedTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    changeTodo(todo.id, { title: normalizedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleESC = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  return (
    <div data-cy="Todo" className={cl('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          aria-label="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => changeTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Empty todo will be deleted"
            onBlur={handleSubmit}
            onKeyUp={e => handleESC(e)}
            ref={editInputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cl('modal overlay', {
          'is-active': todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
