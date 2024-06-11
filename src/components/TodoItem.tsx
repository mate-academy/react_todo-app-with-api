/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import classNames from 'classnames';

interface TodoProps {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  pending: number | null;
  handleToggleTodo: (id: number) => void;
  handleUpdateTodo: (id: number, title: string, completed: boolean) => void;
}

const TodoItem: React.FC<TodoProps> = ({
  todo,
  onDeleteTodo,
  pending,
  handleToggleTodo,
  handleUpdateTodo,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [originalTitle, setOriginalTitle] = useState(todo.title);
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFocused) {
      inputRef.current?.focus();
    }
  }, [inputFocused]);

  const handleDoubleClick = () => {
    setOriginalTitle(todo.title);
    setEditing(true);
  };

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = () => {
    if (editedTitle.trim() === '') {
      onDeleteTodo(todo.id);
    } else if (editedTitle !== originalTitle) {
      handleUpdateTodo(todo.id, editedTitle, todo.completed);
    }

    setEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' || e.key === 'ArrowUp') {
      setEditedTitle(originalTitle);
      setEditing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setEditing(false);
    e.preventDefault();
    if (editedTitle.trim() === '') {
      onDeleteTodo(todo.id);
    } else if (editedTitle !== originalTitle) {
      handleUpdateTodo(todo.id, editedTitle, todo.completed);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await onDeleteTodo(todo.id);
    } catch (error) {
      console.log(error);
    } finally {
      setInputFocused(true);
    }
  };

  useEffect(() => {
    setInputFocused(true);
  }, [inputFocused]);

  const handleToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    event.preventDefault();
    handleToggleTodo(id);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e => handleToggle(e, todo.id)}
        />
      </label>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="todoapp__new-todo"
            onChange={handleNewTitle}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            value={editedTitle}
            autoFocus
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': pending === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
