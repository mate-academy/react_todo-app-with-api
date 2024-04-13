import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoContext } from '../../TodoContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoInfo: React.FC<Props> = ({ todo, isLoading = false }) => {
  const { updateTodo, deleteTodo } = useContext(TodoContext);

  const [beingEdited, setBeingEdited] = useState(false);
  const [loading, setLoading] = useState(isLoading);
  const [title, setTitle] = useState(todo.title);

  const updateTodoTitle = () => {
    setBeingEdited(false);

    if (title.trim() === todo.title) {
      return;
    }

    setLoading(true);

    if (title.trim() === '') {
      deleteTodo(todo.id);

      return;
    }

    updateTodo({ ...todo, title: title.trim() }).finally(() => {
      setLoading(false);
      setBeingEdited(false);
    });
  };

  const handleDoubleClick = () => {
    setBeingEdited(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggle = () => {
    setLoading(true);

    updateTodo({ ...todo, completed: !todo.completed }).finally(() => {
      setLoading(false);
    });
  };

  const handleDelete = () => {
    setLoading(true);

    deleteTodo(todo.id).finally(() => {
      setLoading(false);
    });
  };

  const handleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setBeingEdited(false);
      setTitle(todo.title);
    } else if (event.key === 'Enter') {
      updateTodoTitle();
    }
  };

  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleToggle}
          />
        </label>

        {!beingEdited ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              autoFocus
              value={title}
              onChange={handleTitleOnChange}
              onBlur={updateTodoTitle}
              onKeyUp={handleKeyup}
            />
          </form>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
