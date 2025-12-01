import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;

  editingTodoId: number | null;
  editingTitle: string;
  loadingTodoIds: number[];

  onStartEdit: (id: number, title: string) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;

  onCancelEdit: () => void;

  editFieldRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,

  editingTodoId,
  editingTitle,
  loadingTodoIds,

  onStartEdit,
  onUpdateTitle,
  onDelete,
  onToggle,
  onCancelEdit,

  editFieldRef,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          loadingTodoIds={loadingTodoIds}
          onStartEdit={onStartEdit}
          onUpdateTitle={onUpdateTitle}
          onDelete={onDelete}
          onToggle={onToggle}
          editFieldRef={editFieldRef}
          inputRef={inputRef}
          onCancelEdit={onCancelEdit}
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
              disabled
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
      )}
    </section>
  );
};
