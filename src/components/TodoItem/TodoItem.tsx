/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';
import './TodoItem.scss';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (t: Todo) => void;
  selectedTodo: Todo | undefined;
  onTitleChange: (ev: React.FormEvent) => void;
  redactingInputRef: React.RefObject<HTMLInputElement>;
  redactingQuery: string | undefined;
  setRedactingQuery: (q: string | undefined) => void;
  onTodoSelect: (ev: React.MouseEvent<HTMLSpanElement>) => void;
  onDelete: (todoId: Todo['id']) => void;
  loadingTodoIdS: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  selectedTodo,
  onTitleChange,
  redactingInputRef,
  redactingQuery,
  setRedactingQuery,
  onTodoSelect,
  onDelete,
  loadingTodoIdS,
}) => {
  const { completed, title, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {selectedTodo === todo ? (
        <form onSubmit={onTitleChange} onBlur={onTitleChange}>
          <input
            ref={redactingInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={redactingQuery}
            onChange={ev => setRedactingQuery(ev.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onTodoSelect}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIdS.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
