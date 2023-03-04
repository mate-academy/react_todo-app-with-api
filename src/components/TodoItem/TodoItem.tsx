import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessed?: boolean,
  removeTodo: (todo: Todo) => void,
  changeStatus: (todoChangeStatus: Todo) => void,
  changeTitle: (todoChangeTitle: Todo, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  changeStatus,
  changeTitle,
  isProcessed,
}) => {
  const { title, completed } = todo;

  const [isInputActive, setIsInputActive] = useState(false);
  const [addedTitle, setAddedTitle] = useState(title);

  const editFormRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editFormRef.current && isInputActive) {
      editFormRef.current.focus();
    }
  }, [isInputActive]);

  const changeInputActiveStatus = (status: boolean) => {
    setIsInputActive(status);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedTitle(event.target.value);
  };

  const handleSaveChanges = () => {
    if (title !== addedTitle) {
      changeTitle(todo, addedTitle);
    }

    if (!addedTitle) {
      removeTodo(todo);
    }

    changeInputActiveStatus(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSaveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleSaveChanges();
    }
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
              className="todo__title-field"
              type="text"
              value={addedTitle}
              onChange={handleInput}
              onBlur={handleSaveChanges}
              onKeyUp={handleKeyUp}
              ref={editFormRef}
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
});
