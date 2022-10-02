import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => Promise<void>;
  input: string;
  isAdding: boolean;
  handleStatus: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  removeTodo,
  input,
  isAdding,
  handleStatus,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const handleDelete = (todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => handleStatus(id, { completed: !completed })}
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDelete(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal',
                'overlay',
                { 'is-active': id === deletedId },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {(input.length > 0 && isAdding) && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{input}</span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
