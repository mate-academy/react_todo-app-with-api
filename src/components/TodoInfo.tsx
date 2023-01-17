import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void,
  activeLoading: boolean;
  loader: number;
  tickTodo: (id: number, completed: boolean) => void,
  idToUpdate: number,
  updateTodoTitle: (id: number, title: string) => void,
  isTotalTick:boolean,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  activeLoading,
  loader,
  tickTodo,
  idToUpdate,
  updateTodoTitle,
  isTotalTick,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [isActiveTitle, setIsActiveTitle] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  const submitChangedTitle = (event: React.FormEvent) => {
    event.preventDefault();

    if (changedTitle === title) {
      setChangedTitle(changedTitle);
    }

    if (!changedTitle.length) {
      onDelete(id);
    }

    setIsActiveTitle(false);
    updateTodoTitle(id, changedTitle);
  };

  const cancelUpdate = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setChangedTitle(title);
      setIsActiveTitle(false);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isActiveTitle]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => tickTodo(id, completed)}
        />
      </label>

      {isActiveTitle
        ? (
          <form
            onSubmit={submitChangedTitle}
            onBlur={submitChangedTitle}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={changedTitle}
              onChange={(event) => setChangedTitle(event.target.value)}
              onKeyDown={cancelUpdate}
            />
          </form>

        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsActiveTitle(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': activeLoading || loader === id
            || idToUpdate === id || isTotalTick,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
