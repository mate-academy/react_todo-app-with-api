import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  isEditing: boolean;
  tempTitle: string;
  deleteTodoId: number | null;
  changeStatusTodoId: number | null;

  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onDoubleClick: (todo: Todo) => void;
  onChangeTitle: (value: string) => void;
  onSubmit: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent, id: number) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isEditing,
  tempTitle,
  deleteTodoId,
  changeStatusTodoId,
  onToggle,
  onDelete,
  onDoubleClick,
  onChangeTitle,
  onSubmit,
  onKeyDown,
  onKeyUp,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
      />
    </label>

    {isEditing ? (
      <input
        data-cy="TodoTitleField"
        className="todo__title"
        value={tempTitle}
        onChange={e => onChangeTitle(e.target.value)}
        onBlur={() => onSubmit(todo.id)}
        onKeyDown={e => onKeyDown(e, todo.id)}
        onKeyUp={onKeyUp}
        autoFocus
      />
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onDoubleClick(todo)}
        >
          {todo.title}
        </span>

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
      className={classNames('modal overlay', {
        'is-active': todo.id === deleteTodoId || todo.id === changeStatusTodoId,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
