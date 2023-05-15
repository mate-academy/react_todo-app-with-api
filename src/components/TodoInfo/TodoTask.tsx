import {
  FC, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';

interface Props {
  todo: Todo;
  error: ErrorType;
  isLoading: boolean;
  onRemoveTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, dataToUpdate: Partial<Todo>) => void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  error,
  isLoading,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const editInpurRef = useRef<HTMLInputElement>(null);

  const handleClickRemoveTodo = () => onRemoveTodo?.(todo.id);

  const handleClickToggleTodo = () => {
    onUpdateTodo?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClickTodo = () => setIsEditing(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const updateTitle = () => {
    if (!query.trim()) {
      onRemoveTodo?.(todo.id);
    }

    if (query === todo.title) {
      setIsEditing(false);
    }

    onUpdateTodo(todo.id, { title: query });
    setIsEditing(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTitle();
  };

  const handleBlur = () => {
    updateTitle();
  };

  const handleEscapePress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') {
      return;
    }

    setIsEditing(false);
    setQuery(todo.title);
  };

  useEffect(() => {
    if (error === ErrorType.Update) {
      setQuery(todo.title);
    }
  }, [error]);

  useEffect(() => {
    if (editInpurRef.current) {
      editInpurRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleClickToggleTodo}
          checked={todo.completed}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={editInpurRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              onKeyUp={handleEscapePress}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClickTodo}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleClickRemoveTodo}
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
