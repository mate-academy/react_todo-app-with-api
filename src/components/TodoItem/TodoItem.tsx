/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onRemoveItem?: (todo: Todo) => void;
  onUpdateTodo?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveItem = () => {},
  onUpdateTodo = () => {},
  isLoading,
}) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOnClickCheckBox = () => {
    const newTodo: Todo = { ...todo, completed: !todo.completed };

    onUpdateTodo(newTodo);
  };

  const handleTitleDoubleClick = () => {
    setIsUpdating(true);
  };

  const handleCloseUpdating = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsUpdating(false);
    }
  };

  const updateTodoItem = async () => {
    const inputText = inputElement.current?.value.trim() || '';

    if (inputText === '') {
      onRemoveItem(todo);

      return;
    }

    if (inputText === todo.title) {
      setIsUpdating(false);

      return;
    }

    const newTodo: Todo = { ...todo, title: inputText };

    try {
      await onUpdateTodo(newTodo);
      setIsUpdating(false);
    } catch {}
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodoItem();
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.preventDefault();
    updateTodoItem();
  };

  useEffect(() => {
    if (isUpdating) {
      inputElement.current?.focus();
    }
  }, [isUpdating]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onClick={() => handleOnClickCheckBox()}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isUpdating ? (
        <form onSubmit={handleOnSubmit}>
          <input
            onKeyUp={handleCloseUpdating}
            ref={inputElement}
            onBlur={handleOnBlur}
            defaultValue={todo.title}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (
        <span
          onDoubleClick={handleTitleDoubleClick}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {todo.title}
        </span>
      )}

      {!isUpdating && (
        <button
          onClick={() => onRemoveItem(todo)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
