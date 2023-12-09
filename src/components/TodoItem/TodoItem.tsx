import classNames from 'classnames';

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodo } from '../TodoContext/TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo,
    deleteTodo,
    updateTodo,
    isCompliteDeleting,
    isToogleAllClick,
    isTodoOnUpdate,
  } = useTodo();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef.current]);

  useEffect(() => {
    if (isCompliteDeleting && todo.completed) {
      setIsLoading(true);
    }
  }, [isCompliteDeleting]);

  useEffect(() => {
    if (isTodoOnUpdate?.id === todo.id) {
      setIsLoading(true);
    }

    if (!isTodoOnUpdate) {
      setIsLoading(false);
    }
  }, [isTodoOnUpdate]);

  const handleToggle = () => {
    toggleTodo(todo);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setUpdatedTitle(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const handleUpdateOrDelete = () => {
    if (!updatedTitle.trim()) {
      deleteTodo(todo);
    } else {
      updateTodo(updatedTitle, todo);
    }
  };

  const handleTodoUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    handleUpdateOrDelete();
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleUpdateOrDelete();
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          title="chekbox"
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoUpdate}
          onBlur={handleBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={handleTitleChange}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>

      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading || isToogleAllClick },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
