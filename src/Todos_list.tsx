import React from 'react';
import { Todo } from './Todo';
import { Todo as TodoType } from './types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  todos: TodoType[];
  loadingTodoId?: number | null;
  isAdding?: boolean;
  onUpdate?: (id: number, updates: Partial<TodoType>) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export const TodosList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  isAdding,
  onUpdate,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          loadingTodoId={loadingTodoId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {/* Loader для нової todo під час додавання */}
      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              disabled
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            Adding...
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
