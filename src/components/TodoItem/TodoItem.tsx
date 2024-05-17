/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  isTemp?: boolean;
  onDelete: (id: number) => void;
  todo: Todo;
  toggleById: (todo: Todo, newIsCompleted: boolean) => void;
  onUpdate: (todo: Todo, newTitle: string) => void;
  beingEdited?: boolean;
  beingUpdated: number | null;
};

export const TodoItem: React.FC<Props> = ({
  isTemp = false,
  onDelete,
  todo,
  toggleById,
  onUpdate,
  beingEdited,
  beingUpdated,
}) => {
  const [beingRemoved, setBeingRemoved] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  const todoTitleInput = useRef<HTMLInputElement>(null);

  const finishEditing = () => {
    setIsFormOpen(false);
    setNewTitle(newTitle);
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      finishEditing();
    }
  };

  const handleUpdateTodoFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setBeingRemoved(true);
    }

    if (todo.title === newTitle) {
      setIsFormOpen(false);

      return;
    }

    onUpdate(todo, newTitle);

    Promise.resolve(() => {
      if (beingUpdated === null) {
        finishEditing();
        document.removeEventListener('keyup', handleEscapeKey);
      }
    });
  };

  useEffect(() => {
    if (isFormOpen) {
      todoTitleInput.current?.focus();
    }
  }, [isFormOpen]);

  const handleDoubleClick = () => {
    setIsFormOpen(true);
    document.addEventListener('keyup', event => handleEscapeKey(event));
  };

  const handleBlur = () => {
    onUpdate(todo, newTitle);
    setNewTitle(newTitle);
    setIsFormOpen(false);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            event.preventDefault();
            toggleById(todo, !todo.completed);
          }}
        />
      </label>

      {isFormOpen && (
        <form onSubmit={handleUpdateTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            ref={todoTitleInput}
          />
        </form>
      )}

      {!isFormOpen && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            onClick={() => {
              onDelete(todo.id);
              setBeingRemoved(true);
            }}
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
        className={`modal overlay ${(isTemp || beingRemoved || beingEdited) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
