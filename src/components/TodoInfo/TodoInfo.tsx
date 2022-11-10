/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
  onToggleTodo: (todoId: number, isCompleted: boolean) => void;
  selectedTodoId: number[];
  onChangeTodoTitle: (todoId: number, title: string) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletedTodoIds,
  onToggleTodo,
  selectedTodoId,
  onChangeTodoTitle,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const titleInput = useRef<HTMLInputElement>(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(title);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    if (event.detail === 2) {
      setIsRenaming(true);
    }
  }, []);

  const handleCloseRenaming = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTodoTitle(title);
      setIsRenaming(false);
    }
  }, []);

  const submitNewTodoTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle === title) {
      setNewTodoTitle(title);
      setIsRenaming(false);
    } else if (!newTodoTitle.length) {
      onDeleteTodo(id);
    } else {
      onChangeTodoTitle(id, newTodoTitle);
      setIsRenaming(false);
    }
  }, [newTodoTitle]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isRenaming]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onToggleTodo(id, completed)}
        />
      </label>

      {isRenaming
        ? (
          <form
            onSubmit={submitNewTodoTitle}
            onBlur={submitNewTodoTitle}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleInput}
              defaultValue={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              onKeyDown={handleCloseRenaming}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              role="button"
              tabIndex={0}
              className="todo__title"
              onClick={event => handleDoubleClick(event)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': deletedTodoIds.includes(id)
            || selectedTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
