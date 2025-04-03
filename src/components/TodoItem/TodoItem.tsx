/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  loadingTodo: number[];
  updateTodo: (todo: Todo) => void;
  isEditing: boolean;
  newTitleTodo: string;
  setNewTitleTodo: (title: string) => void;
  startEditing: (todo: Todo) => void;
  cancelEditing: () => void;
  toggleTodo: (todo: Todo) => void;
};

export const Todos: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingTodo,
  updateTodo,
  isEditing,
  newTitleTodo,
  setNewTitleTodo,
  startEditing,
  cancelEditing,
  toggleTodo,
}) => {
  const handleChanges = (event: React.FormEvent) => {
    event.preventDefault();
    updateTodo({ ...todo, title: newTitleTodo.trim() });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" onClick={() => toggleTodo(todo)}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleChanges}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo todo__title"
            value={newTitleTodo}
            onChange={event => setNewTitleTodo(event.target.value)}
            onBlur={handleChanges}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => startEditing(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loadingTodo.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
