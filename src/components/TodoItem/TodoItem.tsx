import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todo: Todo) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
}) => {
  const { title, completed, id } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      onDeleteTodo(todo);
    }

    if (newTitle === title) {
      setIsFormVisible(false);
      setNewTitle(title);
    }

    if (newTitle !== title) {
      handleUpdateTodoTitle(todo, newTitle);
      setIsFormVisible(false);
    }
  };

  const cancelTitleEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
      setNewTitle(title);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleChange();
  };

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleUpdateTodoStatus(todo)}
        />
      </label>

      {isFormVisible
        ? (
          <form
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              onBlur={handleTitleChange}
              onKeyDown={cancelTitleEdit}
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
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(todo)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isUpdatingTodoId === id },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
