/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deletingTodoId: number | null;
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  updateTodo: number[];
  editingTodoId: number | null;
  handleEdit: (todoId: number) => void;
  handleUpdateTitle: (todoId: number, title: string) => void;
  handleCancelEdit: () => void;
};

export const TodoItem = ({
  todo,
  deletingTodoId,
  onDelete,
  onToggle,
  updateTodo,
  editingTodoId,
  handleEdit,
  handleUpdateTitle,
  handleCancelEdit,
}: Props) => {
  const [title, setTitle] = useState(todo.title);

  const isEditing = editingTodoId === todo.id;

  const handleSave = () => {
    const newTitle = title.trim();

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      handleCancelEdit();

      return;
    }

    handleUpdateTitle(todo.id, newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      handleCancelEdit();
    }
  };

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEdit(todo.id)}
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
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletingTodoId === todo.id || updateTodo.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
