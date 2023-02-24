import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleUpdateTodo: (todoId: number, value: boolean | string) => void,
  handleDeleteTodo: (todoId: number) => void,
  isProcessedIds: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleUpdateTodo,
  handleDeleteTodo,
  isProcessedIds,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setIsFormVisible(false);
    }

    if (newTitle !== todo.title) {
      handleUpdateTodo(todo.id, newTitle);
      setIsFormVisible(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleChange();
  };

  const cancelTitleChange = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleUpdateTodo(
            todo.id,
            !todo.completed,
          )}
        />
      </label>

      {isFormVisible
        ? (
          <form onSubmit={(event) => handleFormSubmit(event)}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyUp={cancelTitleChange}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsFormVisible(true)}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': isProcessedIds.includes(todo.id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
