import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isSubmitting?: boolean;
  isDeleting?: Todo;
  isUpdating?: Todo[] | null;
  onSetError: (message: string) => void;
  onSetSubmitting: (value: boolean) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onToggle,
  isSubmitting,
  onDelete,
  isDeleting,
  isUpdating,
  onSetError,
  onSetSubmitting,
  onUpdate,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [submittingTodos, setSubmittingTodos] = useState<number[]>([]);

  const handleSaveTitle = async (id: number) => {
    if (newTitle.trim() === '') {
      onDelete(id);
      return;
    }

    if (newTitle === todo.title) {
      setEditingId(null);
      onSetError('Unable to update a todo');
      return;
    }

    onSetError('');
    onSetSubmitting(true);
    setSubmittingTodos(prev => [...prev, id]);

    try {
      const updatedTodo = { ...todo, title: newTitle.trim() };
      await updateTodo(updatedTodo);
      setEditingId(null);
      onUpdate(updatedTodo);
    } catch {
      onSetError('Unable to update a todo');
    } finally {
      onSetSubmitting(false);
      setSubmittingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSaveTitle(todo.id);
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => handleSaveTitle(todo.id)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingId(null);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
            setNewTitle(todo.title);
          }}
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
          disabled={isSubmitting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isSubmitting ||
          isDeleting?.id === todo.id ||
          isUpdating?.some(updatingTodo => updatingTodo.id === todo.id) ||
          submittingTodos.includes(todo.id)
            ? 'is-active'
            : ''
        }`}
      >
        <div
          className="modal-background
                  has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
