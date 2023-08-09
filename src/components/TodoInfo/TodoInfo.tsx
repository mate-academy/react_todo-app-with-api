import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  onUpdateTodo: (todoToUpdate: Todo, newTitle?: string) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingTodoId,
  onUpdateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const { id, title, completed } = todo;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loadingTodoId === id) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodoId]);

  useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus();
    }
  }, [isEditingTitle]);

  const handleDeleteTodo = () => (
    onDeleteTodo(id)
  );

  const handleUpdateStatus = () => (
    onUpdateTodo(todo)
  );

  const handleDoubleClick = () => (
    setIsEditingTitle(true)
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingTitle(false);
      setNewTitle(todo.title);
    }
  };

  const handleSubmitUpdate = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onUpdateTodo(todo, newTitle);

    setIsEditingTitle(false);
  };

  const handleBlur = () => {
    onUpdateTodo(todo, newTitle);

    setIsEditingTitle(false);
  };

  return (
    <div
      className={classNames('todo', {
        completed: completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateStatus}
        />
      </label>

      {isEditingTitle ? (
        <form
          onSubmit={handleSubmitUpdate}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
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
