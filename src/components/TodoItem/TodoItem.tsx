import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todo: Todo) => void,
  onUpdateTodoStatus: (todo: Todo) => void,
  todosIdInProcess: number[],
  onUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoItem:React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodoStatus,
  todosIdInProcess,
  onUpdateTodoTitle,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const [isFormEnable, setIsFormEnable] = useState(false);

  const handleTitleChange = () => {
    if (!newTodoTitle.trim()) {
      onDeleteTodo(todo);
    } else if (newTodoTitle === todo.title) {
      setIsFormEnable(false);
      setNewTodoTitle(todo.title);
    } else {
      onUpdateTodoTitle(todo, newTodoTitle);
      setIsFormEnable(false);
    }
  };

  const cancelTitleCahnge = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFormEnable(false);
      setNewTodoTitle(todo.title);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleChange();
  };

  const isLoaderActive = todosIdInProcess.includes(todo.id);

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
          onClick={() => onUpdateTodoStatus(todo)}
        />
      </label>

      {isFormEnable
        ? (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={cancelTitleCahnge}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsFormEnable(true)}
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
        { 'is-active': isLoaderActive },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
