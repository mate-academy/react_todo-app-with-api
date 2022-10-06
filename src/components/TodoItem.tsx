import cn from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleUpdateTodos: (id: number, data: {}) => void;
  handleDeleteTodos: (id: number) => void;
  isLoading: boolean;
  selectedTodoId: number;
}

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const {
    todo,
    handleDeleteTodos,
    handleUpdateTodos,
    selectedTodoId,
    isLoading,
  } = props;
  const { id, title, completed } = todo;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const handleTitleUpdate = () => {
    setIsDoubleClicked(false);
    if (updatedTitle === title) {
      return;
    }

    if (updatedTitle.length === 0) {
      handleDeleteTodos(id);

      return;
    }

    handleUpdateTodos(id, { title: updatedTitle });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleTitleUpdate();
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className="todo__status"
          disabled={isDoubleClicked}
          onClick={() => {
            handleUpdateTodos(
              id, { completed: !completed },
            );
          }}
        />
      </label>
      {isDoubleClicked
        ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                placeholder="Empty todo will be deleted"
                value={updatedTitle}
                onChange={(e) => {
                  setUpdatedTitle(e.target.value);
                }}
                className="todo__title-field"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsDoubleClicked(false);
                    setUpdatedTitle(title);
                  }
                }}
                onBlur={handleSubmit}
              />

            </form>
          </>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              role="presentation"
              className="todo__title"
              onDoubleClick={() => {
                setIsDoubleClicked(true);
              }}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodos(id)}
            >
              ×
            </button>
            {(selectedTodoId === id || id === -1) && (
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay',
                  { 'is-active': isLoading })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </>
        )}
    </div>
  );
});
