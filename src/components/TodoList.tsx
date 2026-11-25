/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onUpdate: (
    todo: Todo,
    changes: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<boolean>;
  onDelete: (todo: Todo) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onUpdate,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingIds.includes(todo.id)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={false}
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
