import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoToDelete: Todo) => Promise<void>,
  isLoading: boolean,
  onToggle: (todo: Todo) => void,
  onRename: (todo: Todo, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo, removeTodo, isLoading, onToggle, onRename,
}) => {
  const { title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isActiveForm, setSsActiveForm] = useState(false);

  const handleInputNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleChange = (event: FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      removeTodo(todo);

      return;
    }

    if (newTitle === title) {
      setSsActiveForm(false);

      return;
    }

    onRename(todo, newTitle);
    setSsActiveForm(false);
  };

  const handleEscKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setSsActiveForm(false);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => setSsActiveForm(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={() => onToggle(todo)}
        />
      </label>
      {isActiveForm ? (
        <form onSubmit={handleTitleChange}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleInputNewTitle}
            onKeyUp={handleEscKeyUp}
            onBlur={handleTitleChange}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
