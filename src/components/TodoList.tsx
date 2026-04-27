import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  todoIdLoading: number | null;
  todosIdsLoading: number[];
  updateTodo: (id: number, completed: boolean, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  onDelete,
  todoIdLoading,
  todosIdsLoading,
  updateTodo,
}) => {
  const [title, setTitle] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const inputEditRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputEditRef.current?.focus();
  });

  const handleDoubleClick = (currentTodo: Todo) => {
    setEditingTodo(currentTodo);
    setTitle(currentTodo.title.trim());
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);

    const normalizedTitle = title.trim();

    if (title.length === 0 && editingTodo) {
      onDelete(editingTodo.id).catch(() => setEditingTodo(editingTodo));
    } else if (editingTodo && title.length > 0) {
      updateTodo(editingTodo.id, editingTodo.completed, normalizedTitle)
        .catch(() => {
          setEditingTodo(editingTodo);
        })
        .finally(() => setIsSaving(false));
    }
  };

  const handleBlur = () => {
    const normalizedTitle = title.trim();

    setEditingTodo(null);

    if (isSaving) {
      return;
    }

    if (title.length === 0 && editingTodo) {
      onDelete(editingTodo.id).catch(() => setEditingTodo(editingTodo));
    } else if (editingTodo && title.length > 0) {
      updateTodo(editingTodo.id, editingTodo.completed, normalizedTitle).catch(
        () => {
          setEditingTodo(editingTodo);
        },
      );
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                aria-label="ToDo-Status"
                onChange={() =>
                  updateTodo(todo.id, !todo.completed, todo.title)
                }
              />
            </label>

            {editingTodo && todo.id === editingTodo.id ? (
              <>
                <form onSubmit={handleSubmit}>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    ref={inputEditRef}
                    onKeyUp={handleKeyUp}
                    onBlur={handleBlur}
                  />
                </form>

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active':
                      todo.id === todoIdLoading ||
                      todosIdsLoading.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(todo)}
                >
                  {todo.title}
                </span>

                <button
                  onClick={() => onDelete(todo.id)}
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active':
                      todo.id === todoIdLoading ||
                      todosIdsLoading.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            )}

            {/* Remove button appears only on hover */}

            {/* overlay will cover the todo while it is being deleted or updated */}
          </div>
        );
      })}

      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              aria-label="ToDo-Status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
