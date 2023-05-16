import {
  FC, useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { TodoContext } from '../TodoProvider';

interface Props {
  todo: Todo;
  isLoading: boolean;
}

export const TodoTask: FC<Props> = ({
  todo,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const editInpurRef = useRef<HTMLInputElement>(null);
  const {
    error,
    updateTodo,
    removeTodo,
  } = useContext(TodoContext);

  const handleClickRemoveTodo = () => removeTodo?.(todo.id);

  const handleClickToggleTodo = () => {
    updateTodo?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClickTodo = () => setIsEditing(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const updateTitle = () => {
    if (!query.trim()) {
      removeTodo?.(todo.id);
    }

    if (query === todo.title) {
      setIsEditing(false);
    }

    updateTodo(todo.id, { title: query });
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
