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

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (titleToUpdate.trim()) {
        handleRename(titleToUpdate, todo.id);
      }

      setEditing(false);
    } else if (event.key === 'Escape') {
      setEditing(false);
    }
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
          <form>
            <input
              onKeyUp={handleKeyUp}
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
