/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import classNames from 'classnames';

interface TodoProps {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  pending: number | null;
  handleToggleTodo: () => void;
  handleUpdateTodo: (id: number, title: string) => void;
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

  const handleDoubleClick = () => {
    setEditing(true);
    setEditedTitle(todo.title);
  };

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateTodo(todo.id, editedTitle);
    setEditing(false);
  };

  const handleDeleteClick = async () => {
    try {
      await onDeleteTodo(todo.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    handleToggleTodo();
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
          onChange={handleToggle}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <input onChange={handleNewTitle} value={editedTitle} />
          </form>
        ) : (
          todo.title
        )}
      </span>
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
