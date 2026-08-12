/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  handleDelete: (todoId: number) => void;
  handleUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  loadingTodoIds,
  handleDelete,
  handleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}

      {/* Тимчасова тудушка (під час створення) */}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
