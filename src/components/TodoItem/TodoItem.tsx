import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  editingTodo: Todo | null;
  handleOnClickDelete: (todoForDelate: Todo) => Promise<void>;
  handleOnChangeStatus: (todoForChange: Todo) => Promise<void>;
  handleOnDoubleClick: (thisTodo: Todo) => void;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saveChanges: () => Promise<void>;
  inputRef: RefObject<HTMLInputElement>;
  query: string;
  loadingTodosId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingTodo,
  handleOnClickDelete,
  handleOnChangeStatus,
  handleOnDoubleClick,
  handleOnChange,
  handleOnSubmit,
  saveChanges,
  inputRef,
  query,
  loadingTodosId,
}) => {
  const { id, userId, title, completed } = todo;
  const isTodoLoading = loadingTodosId.includes(id);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          id={`todo-${id}`}
          aria-labelledby={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            handleOnChangeStatus({ id, userId, title, completed })
          }
        />
      </label>

      {editingTodo?.id !== id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() =>
              handleOnDoubleClick({ id, userId, title, completed })
            }
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              handleOnClickDelete({ id, userId, title, completed })
            }
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={query}
            onChange={handleOnChange}
            onBlur={saveChanges}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
