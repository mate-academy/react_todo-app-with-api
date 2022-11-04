import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  changeTodosIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onToggle,
  changeTodosIds,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
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

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onRemove(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal',
              'overlay',
              { 'is-active': changeTodosIds.includes(todo.id) },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
