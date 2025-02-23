/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId: number,
    title: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
};

const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  deleteTodo,
  updateTodo,
}) => {
  const { id, title, completed } = todo;

  const [currentTitle, setCurrentTitle] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setCurrentTitle(title);
    setIsEditing(false);
  }, [title]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleChangeTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTitle = currentTitle.trim();

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      deleteTodo(id);

      return;
    }

    updateTodo(id, newTitle)?.then(() => {
      setCurrentTitle(newTitle);
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setCurrentTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={event => updateTodo(id, currentTitle, event.target.checked)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleChangeTitleSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={currentTitle}
            onBlur={handleChangeTitleSubmit}
            onKeyUp={handleKeyUp}
            onChange={event => setCurrentTitle(event.target.value)}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {currentTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
