/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { FormEvent, KeyboardEvent, RefObject } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isEditing: boolean;
  isProcessing: boolean;
  editingTitle: string;
  editField: RefObject<HTMLInputElement>;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onStartEditing: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onEditSubmit: (event: FormEvent, todo: Todo) => void;
  onEditBlur: (todo: Todo) => void;
  onEditKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isEditing,
  isProcessing,
  editingTitle,
  editField,
  onToggle,
  onDelete,
  onStartEditing,
  onEditingTitleChange,
  onEditSubmit,
  onEditBlur,
  onEditKeyUp,
}) => (
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
        data-cy="TodoStatus"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
    </label>

    {isEditing ? (
      <form onSubmit={event => onEditSubmit(event, todo)}>
        <input
          ref={editField}
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={event => onEditingTitleChange(event.target.value)}
          onBlur={() => onEditBlur(todo)}
          onKeyUp={onEditKeyUp}
        />
      </form>
    ) : (
      <>
        <span
          className="todo__title"
          data-cy="TodoTitle"
          onDoubleClick={() => onStartEditing(todo)}
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
      className={classNames('modal overlay', {
        'is-active': isProcessing,
      })}
      data-cy="TodoLoader"
    >
      <div
        className={classNames('modal-background', 'has-background-white-ter')}
      />
      <div className="loader" />
    </div>
  </div>
);
