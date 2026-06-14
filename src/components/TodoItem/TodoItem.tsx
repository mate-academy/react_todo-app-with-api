/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */


import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;

  editingTodoId: number | null;
  editTitle: string;

  setEditingTodoId: (id: number | null) => void;
  setEditTitle: (title: string) => void;

  handleToggle: (todo: Todo) => void;
  handleDelete: (id: number) => void;
  handleRename: (todo: Todo) => void;

  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  editingTodoId,
  editTitle,
  setEditingTodoId,
  setEditTitle,
  handleToggle,
  handleDelete,
  handleRename,
  editInputRef,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>
      {editingTodoId === todo.id ? (
        <form>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            defaultValue={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => handleRename(todo)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRename(todo);
              }

              if (e.key === 'Escape') {
                setEditingTodoId(null);
                setEditTitle('');
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingTodoId(todo.id);
              setEditTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
