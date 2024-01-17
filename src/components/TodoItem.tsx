import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo: (id: number) => void;
  handleEdit: (todo: Todo) => void;
  activeTodo: (id: number, completed: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  deleteTodo,
  handleEdit,
  activeTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (!trimmedTodoTitle) {
      deleteTodo(todo.id);
    } else if (trimmedTodoTitle !== todo.title) {
      const updatedTodo = { ...todo, title: trimmedTodoTitle };

      setTodoTitle(updatedTodo.title);
      setIsEditing(false);
      handleEdit(updatedTodo);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit(e);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleTitleBlur = (e: React.FormEvent) => {
    handleEditSubmit(e);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => activeTodo(todo.id, todo.completed)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleEditSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            value={todoTitle}
            onBlur={handleTitleBlur}
            onKeyUp={handleKeyUp}
            onChange={(e) => setTodoTitle(e.target.value)}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
