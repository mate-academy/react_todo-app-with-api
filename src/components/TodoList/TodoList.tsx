import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onChange: (isChecked: boolean, id: number) => void;
  onRemove: (id: number, completed: boolean) => void;
  onUpdate: (id: number, title: string) => void;
  tempTodo: null | Todo;
  updatingIds: number[];
}

export const TodoList: React.FC<TodoListProps> = (
  {
    todos,
    onChange,
    onRemove,
    onUpdate,
    tempTodo,
    updatingIds,
  },
) => {
  const [editingId, setEditingId] = useState<null | number>(null);
  const [newTitle, setNewTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleEditTitle = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingId && newTitle.trim().length > 0) {
      onUpdate(editingId, newTitle.trim());
      setEditingId(null);
      setNewTitle('');
    }
  };

  const handleEditKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingId(null);
      setNewTitle('');
    }
  };

  useEffect(() => {
    if (editInputRef.current) {
      if (editingId) {
        editInputRef.current.focus();
      } else {
        editInputRef.current.blur();
      }
    }
  }, [editingId]);

  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        const isUpdating = updatingIds.includes(id);

        return (
          <div
            className={
              classNames(
                'todo',
                { completed },
              )
            }
            key={id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={(event) => onChange(event.target.checked, id)}
              />
            </label>
            {editingId === id ? (
              <form onSubmit={handleEditTitle}>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={event => setNewTitle(event.target.value)}
                  onBlur={handleEditTitle}
                  onKeyUp={handleEditKeyUp}
                  ref={editInputRef}
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingId(id);
                    setNewTitle(title);
                  }}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onRemove(id, completed)}
                >
                  ×
                </button>
              </>
            )}

            <div className={
              classNames(
                'modal',
                'overlay',
                { 'is-active': isUpdating },
              )
            }
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              disabled
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
            disabled
          >
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
