import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, field: Partial<Todo>) => void;
  areAllUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodo,
  areAllUpdating,
}) => {
  const { id, completed, title } = todo;
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRenamingField, setShowRenamingField] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const newTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitleField.current) {
      newTitleField.current.focus();
    }
  }, [showRenamingField]);

  useEffect(() => {
    setIsLoading(false);
  }, [todo]);

  const handleDeletingTodo = (todoId: number) => {
    removeTodo(todoId);
    setIsDeleting(todoId);
  };

  const handleTodoUpdate = (todoId: number, todoField: Partial<Todo>) => {
    setIsLoading(true);
    updateTodo(todoId, todoField);
  };

  const handleNewTitleSubmit = () => {
    setShowRenamingField(false);

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === '') {
      handleDeletingTodo(id);

      return;
    }

    if (title !== newTitle) {
      handleTodoUpdate(id, { title: trimmedNewTitle });
    }
  };

  const cancelRenaming = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setShowRenamingField(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed && 'completed'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleTodoUpdate(id, { completed: !completed })}
        />
      </label>

      {(
        showRenamingField
          ? (
            <form onSubmit={handleNewTitleSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
                onBlur={handleNewTitleSubmit}
                onKeyDown={cancelRenaming}
                ref={newTitleField}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setShowRenamingField(true)}
              >
                { title }
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => handleDeletingTodo(id)}
              >
                ×
              </button>
            </>
          )
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': id === isDeleting || isLoading || areAllUpdating,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
