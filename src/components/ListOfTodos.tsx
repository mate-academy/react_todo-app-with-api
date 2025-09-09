/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  loading: boolean;
  visibleTodos: Todo[];
  processingIds: Record<number, boolean>;
  editingTodoId: number | null;
  editingTitle: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  setEditingTitle: (title: string) => void;
  startEditing: (todo: Todo) => void;
  saveEditing: (todo: Todo) => void;
  cancelEditing: () => void;
  handleToggleTodo: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
}

export const TodosList: React.FC<Props> = ({
  loading,
  visibleTodos,
  processingIds,
  editingTodoId,
  editingTitle,
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
        visibleTodos.map(todo => {
          const isProcessing = !!processingIds[todo.id];

          return (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  disabled={isProcessing}
                />
              </label>

              {editingTodoId === todo.id ? (
                <input
                  data-cy="TodoTitleField"
                  className="todoapp__new-todo"
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
                  disabled={isProcessing}
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': isProcessing,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
    </section>
  );
};
