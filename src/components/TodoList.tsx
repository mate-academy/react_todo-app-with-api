/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  onStartEditing: (todo: Todo) => void;
  onChangeEditingTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEditing: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onUpdateTitle,
  loadingTodoIds,
  tempTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId !== null) {
      inputRef.current?.focus();
    }
  }, [editingTodoId]);

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const saveEditing = async () => {
    if (editingTodoId === null) {
      return;
    }

    const todo = todos.find(t => t.id === editingTodoId);

    if (!todo) {
      cancelEditing();

      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      try {
        await onDelete(editingTodoId);
      } catch {
        alert('Unable to update a todo');
      }

      return;
    }

    try {
      await onUpdateTitle(editingTodoId, trimmedTitle);
      cancelEditing();
    } catch {
      alert('Unable to update a todo');
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isEditing = editingTodoId === todo.id;
        const isLoading = loadingTodoIds.includes(todo.id);

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
              editing: isEditing,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggle(todo.id, !todo.completed)}
                disabled={isLoading}
              />
            </label>

            {isEditing ? (
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                className="todo__edit"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onBlur={saveEditing}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEditing();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEditing();
                  }
                }}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div key="temp" data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" disabled />
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
  );
};
