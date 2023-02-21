import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessed?: boolean,
  removeTodo: (todo: Todo) => void,
  changeStatus: (todoChangeStatus: Todo) => void,
  changeTitle: (todoChangeTitle: Todo, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  changeStatus,
  changeTitle,
  isProcessed,
}) => {
  const { title, completed } = todo;

  const [isInputActive, setIsInputActive] = useState(false);
  const [addedTitle, setAddedTitle] = useState(title);

  const changeInputActiveStatus = (status: boolean) => {
    setIsInputActive(status);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeTitle(todo, addedTitle);
    changeInputActiveStatus(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedTitle(event.target.value);
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => (changeStatus(todo))}
        />
      </label>

      {isInputActive
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={addedTitle}
              onChange={handleInput}
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => (changeInputActiveStatus(true))}
          >
            {title}
          </span>
        )}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo)}
      >
        x
      </button>

      <div className={cn('modal', 'overlay', {
        'is-active': isProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
