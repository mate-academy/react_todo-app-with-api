/* eslint-disable jsx-a11y/label-has-associated-control */

import { updateTodo } from '../api.ts/todos';
import { Todo, ErrorMessage } from '../types/Todo';
import { useEffect, useState, useRef } from 'react';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  deletingIds: number[];
  handleDeleteTodo: (id: number) => void;
  updatingIds: number[];
  handleToggleTodo: (todo: Todo) => void;
  showError: (title: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  deletingIds,
  handleDeleteTodo,
  updatingIds,
  handleToggleTodo,
  showError,
  setTodos,
  setUpdatingIds,
}) => {
  const [editTodo, setEditTodo] = useState<number | null>(null);
  const [saveText, setSaveText] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (saveText.trim() === '') {
      handleDeleteTodo(todo.id);

      return;
    }

    if (saveText === todo.title) {
      setEditTodo(null);

      return;
    }

    setUpdatingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, { title: saveText.trim() });

      setTodos(prev =>
        prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );
      setEditTodo(null);
    } catch {
      showError(ErrorMessage.UnableToggleTodo);
    } finally {
      setUpdatingIds(prev => prev.filter(upd => upd !== todo.id));
    }
  }

  useEffect(() => {
    if (editTodo === todo.id) {
      ref.current?.focus();
    }
  }, [editTodo]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={loading || deletingIds.includes(todo.id)}
          onChange={() => handleToggleTodo(todo)}
        />
      </label>

      {editTodo !== todo.id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditTodo(todo.id);
            setSaveText(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {editTodo === todo.id && (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={saveText}
          ref={ref}
          onChange={e => setSaveText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          onKeyUp={e => {
            if (e.key === 'Escape') {
              setEditTodo(null);
              setSaveText(todo.title);
            }
          }}
        />
      )}

      {/* Remove button appears only on hover */}
      {editTodo !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={deletingIds.includes(todo.id)}
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${deletingIds.includes(todo.id) || updatingIds.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
