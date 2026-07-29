/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (todoId: number) => void;
  toggleTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo) => Promise<void>;
}

const TodoListComponent: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  toggleTodo,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => {
      const isLoading = loadingTodoIds.includes(todo.id);

      return (
        <TodoItem
          todo={todo}
          isLoading={isLoading}
          onDelete={onDelete}
          toggleTodo={toggleTodo}
          onUpdate={onUpdateTodo}
          key={todo.id}
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

export const TodoList = memo(TodoListComponent);
