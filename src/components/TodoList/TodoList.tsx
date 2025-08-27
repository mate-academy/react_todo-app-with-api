/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  isSubmitting: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onChangeTitle: (value: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onKeyUpEdit: (e: React.KeyboardEvent<HTMLInputElement>, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  editingTodoId,
  editingTitle,
  isSubmitting,
  onToggle,
  onDelete,
  onEdit,
  onChangeTitle,
  onSaveEdit,
  onKeyUpEdit,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingTodoIds.includes(todo.id)}
        isUpdating={updatingTodoIds.includes(todo.id)}
        isEditing={editingTodoId === todo.id}
        editingTitle={editingTitle}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onChangeTitle={onChangeTitle}
        onSaveEdit={onSaveEdit}
        onKeyUpEdit={onKeyUpEdit}
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

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isSubmitting ? 'is-active' : 'hidden'}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
