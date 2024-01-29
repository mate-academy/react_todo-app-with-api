import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoProps = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  loader?: boolean;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  deleteTodo,
  loader,
  onUpdateTodo,
}) => {
  const { title, completed, id: Id } = todo;
  const [isLoader, setIsLoader] = useState(loader);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(title);
    }
  }, [isEditing, title]);

  const onDelete = (id: number) => {
    setIsLoader(true);
    deleteTodo(id)
      .catch((error) => {
        setIsLoader(false);
        throw error;
      })
      .then(() => setIsLoader(false));
  };

  const handleCheckboxChange = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setIsLoader(true);

    onUpdateTodo(updatedTodo)
      .catch((error) => {
        setIsLoader(false);
        throw error;
      })
      .then(() => {
        setIsLoader(false);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditSubmit = () => {
    setIsLoader(true);
    if (editedTitle.trim() === '') {
      deleteTodo(Id)
        .catch(() => field.current?.focus());
    } else if (editedTitle !== title) {
      onUpdateTodo({
        ...todo,
        title: editedTitle.trim(),
      })
        .catch((error) => {
          setIsLoader(false);
          setIsEditing(false);
          throw error;
        })
        .then(() => {
          setIsLoader(false);
          setIsEditing(false);
        });
    } else {
      setIsLoader(false);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [isEditing]);

  const handleEditBlur = () => {
    handleEditSubmit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditSubmit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: !!completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleCheckboxChange}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          ref={field}
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={handleEditChange}
          onBlur={handleEditBlur}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEditClick}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(Id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
