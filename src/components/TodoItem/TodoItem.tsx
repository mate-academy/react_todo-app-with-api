import classNames from 'classnames';
import {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  updateTodos: (id: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number;
  toggleLoader: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  updateTodos,
  isLoading,
  selectedId,
  toggleLoader,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const handleTitleChange = (e: FormEvent) => {
    e.preventDefault();
    setDoubleClick(false);

    if (!updatedTitle.trim().length) {
      onDelete(todo.id);
    }

    updateTodos(todo.id, { title: updatedTitle });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTitleChange(event);
    } else if (event.key === 'Escape') {
      setDoubleClick(false);
    }
  };

  const handleTodoCheckboxChange = () => {
    updateTodos(todo.id, { completed: !todo.completed });
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoCheckboxChange}
        />
      </label>

      {doubleClick ? (
        <form onSubmit={handleTitleChange}>
          <input
            data-cy="TodoTitleField"
            value={updatedTitle}
            type="text"
            ref={newTodoField}
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            onChange={(event) => setUpdatedTitle(event.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setDoubleClick(true);
              setUpdatedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onDelete(todo.id);
            }}
          >
            ×
          </button>

          {selectedId === todo.id && (
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </>
      )}

      {toggleLoader && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
