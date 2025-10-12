import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: Set<number>;
  updatingIds: Set<number>;
  isAdding: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number, next: boolean) => void;
  onRename: (id: number, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  updatingIds,
  isAdding,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isDeleting={deletingIds.has(todo.id)}
              isUpdating={updatingIds.has(todo.id)}
              onDelete={onDelete}
              onToggle={onToggle}
              onRename={onRename}
            />
          ))}
        </section>
      )}

      {isAdding && tempTodo && (
        <section className="todoapp__main">
          <div data-cy="Todo" className="todo">
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
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

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section>
      )}
    </>
  );
};
