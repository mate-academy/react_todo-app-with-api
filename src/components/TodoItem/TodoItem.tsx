import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodos: number[];
  handleRemoveTodo: (id: number) => void;
  handleTodoStatusUpdate: (todo: Todo) => void;
  handleTodoTitleUpdate: (todo: Todo, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodos,
  handleRemoveTodo,
  handleTodoStatusUpdate,
  handleTodoTitleUpdate,
}) => {
  const { id, title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isDoubleClicked]);

  const handleDoubleClick = () => {
    setIsDoubleClicked(true);
  };

  const handleTodoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const saveChanges = () => {
    handleTodoTitleUpdate(todo, newTitle);
    setIsDoubleClicked(false);
  };

  const handleOnBlur = () => {
    if (!newTitle.trim()) {
      handleRemoveTodo(id);
    }

    saveChanges();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      handleRemoveTodo(id);
    }

    if (newTitle === title) {
      setNewTitle(title);
      setIsDoubleClicked(false);

      return;
    }

    saveChanges();
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsDoubleClicked(false);
    }
  };

  const handleUpdateStatus = () => {
    handleTodoStatusUpdate(todo);
  };

  const handleRemove = () => {
    handleRemoveTodo(id);
  };

  const isTodoLoading = loadingTodos.includes(id);

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleUpdateStatus}
        />
      </label>

      {isDoubleClicked
        ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleOnBlur}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleTodoInput}
              onKeyDown={handleCancel}
              ref={todoInputRef}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemove}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay',
        { 'is-active': isTodoLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
