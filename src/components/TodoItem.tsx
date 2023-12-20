import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  currentId: number | null,
  handleDeleteTodo: (todo: Todo) => void,
  handleUpdateTodo: (todo: Todo) => Promise<void>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  currentId,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const { title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (newTitle.trim()) {
      case '':
        handleDeleteTodo(todo);

        break;

      case title:
        setIsEditing(false);
        setNewTitle(title);

        break;

      case newTitle:
      default:
        handleUpdateTodo({
          ...todo, title: newTitle.trim(), completed: !completed,
        })
          .finally(() => {
            setIsEditing(false);
          });
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      setIsEditing(false);
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => setIsEditing(true)}
      className={classNames('todo', { completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': currentId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
