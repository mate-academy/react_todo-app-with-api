import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isSubmitting: boolean;
  deletedTodoId: number;
  handleRemoveTodo: (todoId: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoElement: React.FC<Props> = ({
  todo,
  isSubmitting,
  deletedTodoId,
  handleRemoveTodo,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState(todo.title);

  const { title, completed } = todo;

  const handleToggleTodo = () => {
    const updatedTodo = { ...todo, completed: !completed };

    handleUpdateTodo(updatedTodo);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editText.trim() === '') {
        handleRemoveTodo(todo.id);
      } else {
        handleUpdateTodo({ ...todo, title: editText });
      }

      setIsEditing(false);
    } else if (event.key === 'Escape') {
      setEditText(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editText.trim() === '') {
      handleRemoveTodo(todo.id);
    } else {
      handleUpdateTodo({ ...todo, title: editText });
    }

    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleToggleTodo}
          defaultChecked={completed}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editText}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            (isSubmitting && todo.id === 0) ||
            (isSubmitting && todo.id === deletedTodoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
