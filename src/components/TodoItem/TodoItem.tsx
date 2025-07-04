import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  loading: boolean;
  editingTodoId?: number | null;
  setEditingTodoId: (id: number | null) => void;
  setErrorMessage: (message: string | null) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  loading,
  editingTodoId,
  setEditingTodoId,
  setErrorMessage,
  updateTodoTitle,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { id, title, completed } = todo;

  const handleToggle = async () => {
    setIsToggling(true);

    try {
      await toggleTodo(todo);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsToggling(false);
    }
  };

  const handleSave = async () => {
    const trimmed = editedTitle.trim();

    if (trimmed === '') {
      await deleteTodo(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setEditingTodoId(null);

      return;
    }

    try {
      setIsSaving(true);
      await updateTodoTitle(todo.id, trimmed);
      setEditingTodoId(null);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label htmlFor={`${id}`} className="todo__status-label">
        {}
        <input
          id={`${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              handleSave();
            }

            if (e.key === 'Escape') {
              setEditedTitle(todo.title);
              setEditingTodoId(null);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          {title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loading || isSaving || isToggling,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
