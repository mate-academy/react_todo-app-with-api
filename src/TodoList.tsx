import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoadingIds: number[];
  editTodo: Todo | null;
  editTitle: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  onDelete: (id: number) => void;
  onStatusToggle: (todo: Todo) => void;
  onEditStart: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onEditSave: (isCancel: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoadingIds,
  editTodo,
  editTitle,
  editInputRef,
  onDelete,
  onStatusToggle,
  onEditStart,
  onEditChange,
  onEditSave,
}) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoadingIds.includes(todo.id)}
            editTodo={editTodo}
            editTitle={editTitle}
            editInputRef={editInputRef}
            onDelete={onDelete}
            onStatusToggle={onStatusToggle}
            onEditStart={onEditStart}
            onEditChange={onEditChange}
            onEditSave={onEditSave}
          />
        ))}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

            <div className="modal overlay is-active" data-cy="TodoLoader">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
