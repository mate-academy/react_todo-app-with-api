import classNames from 'classnames';
import React, { useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';
import { closeNotification } from '../../utils/closeNotification';

type Props = {
  todo: Todo,
  onDeleteTodo: (todo: Todo) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
  setIsError: (value: boolean) => void,
  setErrorMessage: (value: ErrorMessages) => void,
};

export const TodoInfo:React.FC<Props> = ({
  todo,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
  setIsError,
  setErrorMessage,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle) {
      onDeleteTodo(todo);
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
          <form onSubmit={(event) => {
            event.preventDefault();
            handleTitleChange();
          }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={() => {
                handleTitleChange();
                setIsError(true);
                setErrorMessage(ErrorMessages.UPDATE);
                closeNotification(setIsError, false, 3000);
              }}
              onKeyDown={cancelTitleCahnge}
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
