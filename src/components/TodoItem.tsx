import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (value: number) => void;
  handleUpdateTodo: (value: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleUpdateTodo,
  isLoading,
}) => {
  const { id, completed, title } = todo;

  const [isEditStatus, setIsEditStatus] = useState(false);
  const [editInput, setEditInput] = useState(title);

  const editFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [isEditStatus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleToggle = () => {
    const newTodo = {
      ...todo,
      completed: !completed,
    };

    handleUpdateTodo(newTodo);
  };

  const handleOnBlur = () => {
    setIsEditStatus(false);

    if (!editInput.trim()) {
      handleDeleteTodo(id);

      return;
    }

    handleUpdateTodo({ ...todo, title: editInput.trim() });

    setEditInput(editInput.trim());
  };

  const handleKey = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case ('Escape'):
        setEditInput(title);
        setIsEditStatus(false);
        break;

      case ('Enter'):
        handleOnBlur();
        break;

      default:
        break;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => setIsEditStatus(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {isEditStatus ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editInput}
            onChange={(event) => setEditInput(event.target.value)}
            onKeyUp={handleKey}
            ref={editFocus}
            onBlur={handleOnBlur}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover  */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
