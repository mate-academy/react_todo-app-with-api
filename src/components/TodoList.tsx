/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  editingId: number | null;
  editTitle: string;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (value: string) => void;
  onSaveEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  editingId,
  editTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onEditTitleChange,
  onSaveEditing,
  onCancelEditing,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <div
        data-cy="Todo"
        className={todo.completed ? 'todo completed' : 'todo'}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
        </label>

        {editingId === todo.id ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              onSaveEditing(todo);
            }}
          >
            <input
              data-cy="TodoTitleField"
              autoFocus
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={event => onEditTitleChange(event.target.value)}
              onBlur={() => onSaveEditing(todo)}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  onCancelEditing();
                }
              }}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => onStartEditing(todo)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={
            loadingTodoIds.includes(todo.id)
              ? 'modal overlay is-active'
              : 'modal overlay'
          }
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={tempTodo.completed}
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
