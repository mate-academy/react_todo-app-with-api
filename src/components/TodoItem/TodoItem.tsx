import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isTemp?: boolean;
  updateTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isTemp,
  updateTodo,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(title);

  useEffect(() => {
    setNewTitle(title);
    setOriginalTitle(title);
  }, [title]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const deleteTodoItem = () => {
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
    setIsEditing(false);
    setIsLoading(false);
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
          onChange={() => {
            const updatedCompleted = !completed;

            updateTodo({
              ...todo,
              completed: updatedCompleted,
            });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
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

      {(isLoading || !isTemp) && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
