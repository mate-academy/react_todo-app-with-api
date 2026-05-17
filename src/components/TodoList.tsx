import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  editingTitle: string;
  editingTodoId: number | null;
  loading: boolean;
  onCancelEditing: () => void;
  onDelete: (todoId: number) => void;
  onEditingTitleChange: (title: string) => void;
  onRename: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  processingIds: number[];
  tempTodo: Todo | null;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  editingTitle,
  editingTodoId,
  loading,
  onCancelEditing,
  onDelete,
  onEditingTitleChange,
  onRename,
  onStartEditing,
  onToggle,
  processingIds,
  tempTodo,
  todos,
}) => {
  if ((todos.length === 0 && !tempTodo) || loading) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <span
            className="todo__status-label"
            onClick={() => onToggle(todo)}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </span>

          {editingTodoId === todo.id ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                onRename(todo);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editingTitle}
                onChange={event => onEditingTitleChange(event.target.value)}
                onBlur={() => onRename(todo)}
                onKeyUp={event => {
                  if (event.key === 'Escape') {
                    onCancelEditing();
                  }
                }}
                autoFocus
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
            className={`modal overlay ${processingIds.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" key={tempTodo.id} className="todo">
          <span className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </span>

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
