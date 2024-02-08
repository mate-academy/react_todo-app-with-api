import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  tempLoading?: boolean;
  completedLoading?: boolean;
  toggleAllChangedLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  tempLoading,
  updateTodo,
  completedLoading,
  toggleAllChangedLoading,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewTitle(title);
    setOriginalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const deleteTodoItem = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    deleteTodo(id);
  };

  const cancelEditing = () => {
    setNewTitle(originalTitle);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!newTitle.trim()) {
      deleteTodoItem();

      return;
    }

    if (newTitle === originalTitle) {
      cancelEditing();

      return;
    }

    setIsLoading(true);

    const updatedTodo: Todo = { ...todo, title: newTitle };

    updateTodo(updatedTodo);

    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
    }, 500);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleBlur = () => {
    saveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const todoStatusUpdate = () => {
    const updatedCompleted = !completed;

    updateTodo({
      ...todo,
      completed: updatedCompleted,
    });
  };

  const isLoader = () => {
    return (isLoading
      || tempLoading
      || (completedLoading && todo.completed === true)
      || toggleAllChangedLoading);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed, editing: isEditing })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={todoStatusUpdate}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={deleteTodoItem}
          >
            ×
          </button>
        </>
      )}

      {isLoader() && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
