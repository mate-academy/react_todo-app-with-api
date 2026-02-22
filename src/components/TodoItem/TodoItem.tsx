/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleRemoveButton?: (id: number) => void;
  loadingsIds?: number[];
  toggleTodo: (id: number) => void;
  setEditingTodoId: (id: number | null) => void;
  isEditing: boolean;
  handleEditing: (id: number) => void;
  handleUpdateTodo: (id: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleRemoveButton = () => {},
  loadingsIds = [],
  toggleTodo,
  setEditingTodoId,
  isEditing,
  handleEditing,
  handleUpdateTodo,
}) => {
  const isLoading = loadingsIds.includes(todo.id);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocusRef.current?.focus();
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTitle(e.target.value);

  const handleBlur = () => handleUpdateTodo(todo.id, newTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateTodo(todo.id, newTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape') {
    setEditingTodoId(null);
  }
};

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          disabled={isLoading}
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditing(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveButton(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputFocusRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
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
