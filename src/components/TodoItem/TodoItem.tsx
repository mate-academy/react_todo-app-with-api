import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  isLoading: (id: number) => boolean;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  saveTodo: (id: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  toggleTodo,
  removeTodo,
  isLoading,
  todo,
  editingTodoId,
  setEditingTodoId,
  saveTodo,
}) => {
  const [title, setTitle] = useState(todo.title);
  const isEditing = editingTodoId === todo.id;

  const handleSave = () => {
    const trimmed = title.trim();

    if (trimmed === todo.title) {
      setEditingTodoId(null);
      setTitle(todo.title);

      return;
    }

    if (trimmed === '') {
      return removeTodo(todo.id);
    }

    saveTodo(todo.id, trimmed);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-${todo.id}`}
        aria-label="Mark as completed"
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <input
          autoFocus
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              handleSave();
            }

            if (e.key === 'Escape') {
              setEditingTodoId(null);
              setTitle(todo.title);
            }
          }}
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
