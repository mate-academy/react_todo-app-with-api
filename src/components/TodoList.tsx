/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => Promise<void>;
  isLoading: number[];
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDelete,
  isLoading,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onUpdate={onUpdate}
            isLoading={isLoading.includes(todo.id)}
          />
        );
      })}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
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
