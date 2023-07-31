import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo, TodoData } from '../../types/Todo';

interface Props {
  todo: Todo;
  isProcessed: boolean;
  onDelete?: () => void;
  onChange?: (todoId: number, data: TodoData) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete = () => { },
  onChange = () => { },
}) => {
  const { title, completed, id } = todo;
  const [isTitleEditing, setIsTitelEditing] = useState(false);
  const [titleOfEditingTodo, setTitleOfEditingTodo] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTitleEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.outline = 'none';
    }
  }, [isTitleEditing]);

  const changeTitle = () => {
    if (!titleOfEditingTodo) {
      onDelete();
    } else if (titleOfEditingTodo !== title) {
      onChange(id, { title: titleOfEditingTodo });
    }

    setIsTitelEditing(false);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleOfEditingTodo(title);
      setIsTitelEditing(false);
    }
  };

  return (
    <li className="todo__item">
      <div
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
            onClick={() => onChange(todo.id, { completed: !todo.completed })}
          />
        </label>

        {isTitleEditing ? (
          <form onSubmit={changeTitle}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleOfEditingTodo}
              ref={inputRef}
              onChange={(input) => setTitleOfEditingTodo(input.target.value)}
              onBlur={changeTitle}
              onKeyUp={cancelEditing}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsTitelEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

        <div className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </li>
  );
};
