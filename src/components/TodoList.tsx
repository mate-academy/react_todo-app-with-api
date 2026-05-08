/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteIds: number[];
  onDelete: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  isAdding: boolean;
  loadingIds: number[];
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteIds,
  onDelete,
  tempTodo,
  isAdding,
  loadingIds,
  onToggle,
  onRename,
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editedTitle, setEditedTitle] = React.useState('');

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditedTitle(todo.title);
  };

  const handleEditCancel = (todo: Todo) => {
    setEditedTitle(todo.title);
    setEditingId(null);
  };

  const handleEditSubmit = async (todo: Todo) => {
    const trimmed = editedTitle.trim();

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmed) {
      try {
        await onDelete(todo.id);
      } catch {
        //
      }

      return;
    }

    try {
      await onRename(todo, trimmed);

      setEditingId(null);
    } catch {
      // keep opened
    }
  };

  const handleEditKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (e.key === 'Escape') {
      handleEditCancel(todo);
    }

    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
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
              onChange={() => onToggle(todo)}
            />
          </label>

          {editingId === todo.id ? (
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={() => handleEditSubmit(todo)}
              onKeyUp={e => handleEditKeyUp(e, todo)}
              autoFocus
            />
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleEditStart(todo)}
            >
              {todo.title}
            </span>
          )}

          {editingId !== todo.id && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${
              deleteIds.includes(todo.id) || loadingIds.includes(todo.id)
                ? 'is-active'
                : 'is-hidden'
            }`}
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
            onClick={() => onDelete(tempTodo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${isAdding ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
