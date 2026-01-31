/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo, TodoFilter } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: TodoFilter;
  processings: Set<number>;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => Promise<boolean>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  filter,
  processings,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEditing = async (todo: Todo) => {
    const trimmed = editingTitle.trim();

    if (!trimmed) {
      try {
        await onDelete(todo.id);
      } catch {}

      return;
    }

    if (trimmed === todo.title) {
      cancelEditing();

      return;
    }

    const success = await onRename(todo.id, trimmed);

    if (success) {
      cancelEditing();
    }
  };

  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const isEditing = editingId === todo.id;
            const isProcessing = processings.has(todo.id);

            return (
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
                    disabled={isProcessing}
                    onChange={() => onToggle(todo.id, !todo.completed)}
                  />
                </label>

                {isEditing ? (
                  <input
                    data-cy="TodoTitleField"
                    value={editingTitle}
                    className="todo__title-field"
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
                    autoFocus
                  />
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => startEditing(todo)}
                  >
                    {todo.title}
                  </span>
                )}

                {!isEditing && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => onDelete(todo.id)}
                    disabled={isProcessing}
                  >
                    ×
                  </button>
                )}

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${isProcessing ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && (
            <div className="todo" data-cy="Todo">
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

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
