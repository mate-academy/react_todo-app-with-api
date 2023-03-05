import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoInfoPropsType {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodo: (todoId: number, todo: Partial<Todo>) => void,
}

export const TodoInfo: React.FC<TodoInfoPropsType> = ({
  todo,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDeleteTodoOnClick = () => {
    handleDeleteTodo(todo.id);
    setIsLoading(true);
  };

  const handleUpdateTodoOnClick = () => {
    handleUpdateTodo(todo.id, { completed: !todo.completed });
  };

  const handleSubmit = () => {
    handleUpdateTodo(todo.id, { title });
    setEditMode(false);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      onDoubleClick={() => {
        setEditMode(true);
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleUpdateTodoOnClick}
        />
      </label>

      {editMode
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              className="todo__title-change"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        ) : (
          <span
            className="todo__title"
          >
            {title}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodoOnClick}
      >
        ×
      </button>
      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader is-loading" />
      </div>
    </div>
  );
};
