import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo?: (id: number) => void;
  procesedTodoIds: number[];
  updateTodo?: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    procesedTodoIds,
    removeTodo,
    updateTodo,
  }) => {
    const { title, completed, id } = todo;
    const isLoaderCovered = procesedTodoIds.includes(id);
    const [input, setInput] = useState('');
    const [isBeingEdited, setIsBeingEdited] = useState(false);

    const inputElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputElement.current?.focus();
    }, [isBeingEdited]);

    const handleTodoRemove = () => {
      if (removeTodo) {
        removeTodo(id);
      }
    };

    const handleStatusChange = () => {
      if (updateTodo) {
        updateTodo(id, { completed: !completed });
      }
    };

    const handleTitleUpdate = () => {
      setIsBeingEdited(false);

      const trimmedInput = input.trim();

      if (trimmedInput === title) {
        return;
      }

      if (!input && removeTodo) {
        removeTodo(id);

        return;
      }

      if (updateTodo) {
        updateTodo(id, { title: trimmedInput });
      }
    };

    const handleDoubleClick = () => {
      setInput(title);
      setIsBeingEdited(true);
    };

    const handleCancelUpdate = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (event.key === 'Escape') {
        setInput('');
        setIsBeingEdited(false);
      }
    };

    return (
      <div className={classNames('todo', { completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleStatusChange}
          />
        </label>

        {isBeingEdited ? (
          <form
            onSubmit={handleTitleUpdate}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onBlur={handleTitleUpdate}
              onKeyUp={handleCancelUpdate}
              ref={inputElement}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoRemove}
            >
              ×
            </button>
          </>
        )}

        {isLoaderCovered && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    );
  },
);
