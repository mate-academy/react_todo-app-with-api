/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { FC, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoId: number[];
  isLoading: boolean;
  updateTodo: (updatedTodo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoItem: FC<Props> = ({
  onDeleteTodo,
  todo,
  loadingTodoId,
  isLoading,
  updateTodo,
  editingTodoId,
  setEditingTodoId,
}) => {
  const [changedTitle, setChangedTitle] = useState(todo.title);
  const changedTitleTrim = changedTitle.trim();

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (changedTitleTrim === '') {
      onDeleteTodo(todo.id);

      return;
    }

    if (changedTitleTrim === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (changedTitleTrim) {
      updateTodo({ ...todo, title: changedTitleTrim });
    }
  };

  const handleBlur = () => {
    if (changedTitleTrim === '') {
      onDeleteTodo(todo.id);

      return;
    }

    if (changedTitleTrim !== todo.title) {
      updateTodo({ ...todo, title: changedTitleTrim });
    }

    setEditingTodoId(null);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangedTitle(todo.title);
      setEditingTodoId(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={!todo.id}
          onChange={event =>
            updateTodo({ ...todo, completed: event.target.checked })
          }
        />
      </label>

      {editingTodoId === todo.id ? (
        <form onSubmit={handleSave}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onBlur={handleBlur}
            onChange={event => {
              setChangedTitle(event.target.value);
            }}
            onKeyUp={handleEscape}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setEditingTodoId(todo.id)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={() => onDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoId.includes(todo.id) || !todo.id || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
