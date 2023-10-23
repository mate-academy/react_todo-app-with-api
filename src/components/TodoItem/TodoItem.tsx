import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import * as todosServices from '../../api/todos';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  activeTodoId: number | null,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodo,
  activeTodoId,
  isLoading,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line no-console
  console.log(isLoading);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // eslint-disable-next-line max-len
  function handleEdit(event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>) {
    event.preventDefault();

    const trimmedEditTitle = editTitle.trim();

    setIsEditing(true);
    if (trimmedEditTitle !== title) {
      const data = {
        ...todo,
        title: trimmedEditTitle,
      };

      todosServices.updateTodos(data)
        .then(() => setIsEditing(false));
    } else {
      setIsEditing(false);
    }
  }

  function handleEditCancel() {
    setIsEditing(false);
    setEditTitle(title);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleEdit}
        >
          <input
            className="todo__title-field"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            ref={inputRef}
            onBlur={handleEdit}
            onKeyUp={key => {
              if (key.code === 'Escape') {
                handleEditCancel();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* Remove button appears only on hover */}

      {/* overlay will cover the todo while it is being updated */}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': activeTodoId === todo.id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
