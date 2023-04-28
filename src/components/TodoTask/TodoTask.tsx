import React, {FC, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo;
  isLoading: boolean;
  error: ErrorType;
  removeTodo: (todoId: number) => void;
  changeTodo: (todoId: number, updatedData: Partial<Todo>) => void;
};

export const TodoTask: FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  changeTodo,
  error,
}) => {
  const [isEditing, setEdited] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleOnClickRemoveTodo = () => removeTodo(todo.id);

  const handleOnClickToggleTodoStatus = () => {
    changeTodo(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClickTask = () => setEdited(true);

  const handleOnChangeTitleTask = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setQuery(event.target.value);

  const editTitle = () => {
    if (!query.trim()) {
      removeTodo(todo.id);

      return;
    }

    if (query === todo.title) {
      setEdited(false);

      return;
    }

    changeTodo(todo.id, { title: query });
    setEdited(false);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    editTitle();
  };

  const handleOnBlur = () => {
    editTitle();
  };

  const handleOnEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEdited(false);
    setQuery(todo.title);
  };

  useEffect(() => {
    if (error === ErrorType.UPDATE) {
      setQuery(todo.title);
    }
  }, [error]);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={classNames('todo',
        {
          completed: todo.completed,
        })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleOnClickToggleTodoStatus}
          checked={todo.completed}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleOnSubmit}>
            <input
              ref={editInputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={handleOnChangeTitleTask}
              onBlur={handleOnBlur}
              onKeyUp={handleOnEsc}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClickTask}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleOnClickRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
