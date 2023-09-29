/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    handleDeleteTodo, loading, handleToggleTodo, handleRename,
  }
    = useContext(TodoContext);

  const [editing, setEditing] = useState(false);
  const [titleToUpdate, setTitleToUpdate] = useState(todo.title);

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (titleToUpdate !== todo.title && titleToUpdate.length !== 0) {
        await handleRename(titleToUpdate, todo.id);
      } else if (titleToUpdate.length === 0) {
        await handleDeleteTodo(todo.id);
      }

      setEditing(false);
    }

    if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  const handleBlur = async (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    if (event.type === 'blur') {
      if (titleToUpdate !== todo.title && titleToUpdate.length !== 0) {
        await handleRename(titleToUpdate, todo.id);
      } else if (titleToUpdate.length === 0) {
        await handleDeleteTodo(todo.id);
      }
    }

    setEditing(false);
  };

  return (
    <>
      <div
        key={todo.id}
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleToggleTodo(todo.id)}
          />
        </label>

        {editing ? (
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              onKeyUp={handleKeyUp}
              onBlur={handleBlur}
              type="text"
              className="todo__title-field"
              placeholder={titleToUpdate}
              value={titleToUpdate}
              onChange={(event) => setTitleToUpdate(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setEditing(true);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        {loading.includes(todo.id) && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
