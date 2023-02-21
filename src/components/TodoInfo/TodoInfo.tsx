import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todo: Todo) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoInfo:React.FC<Props> = ({
  todo,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      onDeleteTodo(todo);

      return;
    }

    if (newTitle === todo.title) {
      setIsFormVisible(false);
      setNewTitle(todo.title);
    }

    if (newTitle !== todo.title) {
      handleUpdateTodoTitle(todo, newTitle);
      setIsFormVisible(false);
    }
  };

  const cancelTitleCahnge = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
      setNewTitle(todo.title);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleChange();
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleUpdateTodoStatus(todo)}
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
              onKeyDown={cancelTitleCahnge}
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
        { 'is-active': isUpdatingTodoId === todo.id },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
