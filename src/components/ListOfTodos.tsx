import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  loading: boolean;
  visibleTodos: Todo[];
  updatingTodos: Record<number, boolean>;
  editingTodoId: number | null;
  editingTitle: string;
  isDelete: number | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  setEditingTitle: (title: string) => void;
  startEditing: (todo: Todo) => void;
  saveEditing: (todo: Todo) => void;
  cancelEditing: () => void;
  handleToggleTodo: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
}

export const ListOfTodos: React.FC<Props> = ({
  loading,
  visibleTodos,
  updatingTodos,
  editingTodoId,
  editingTitle,
  isDelete,
  editInputRef,
  setEditingTitle,
  startEditing,
  saveEditing,
  cancelEditing,
  handleToggleTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!loading &&
        visibleTodos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={`todo ${todo.completed ? 'completed' : ''}`}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                disabled={!!updatingTodos[todo.id]}
              />
            </label>

            {editingTodoId === todo.id ? (
              <input
                data-cy="TodoTitleField"
                className="todo__title todo__edit"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onBlur={() => saveEditing(todo)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    saveEditing(todo);
                  }

                  if (e.key === 'Escape') {
                    cancelEditing();
                  }
                }}
                ref={editInputRef}
              />
            ) : (
              <span
                className="todo__title"
                data-cy="TodoTitle"
                onDoubleClick={() => startEditing(todo)}
              >
                {todo.title}
              </span>
            )}

            {editingTodoId === todo.id ? null : (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${
                isDelete === todo.id || updatingTodos[todo.id] ? 'is-active' : ''
              }`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
    </section>
  );
};
