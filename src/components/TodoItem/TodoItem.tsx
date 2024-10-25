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
  loadingTodoId: number;
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
  loadingTodoId,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
            {todo.title}
          </span>
          {/* already shown only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          // overlay is shown upon deleting todo
          'is-active': loadingTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
