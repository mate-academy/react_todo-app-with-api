import React from 'react';
import { Todo } from '../../types/Todo';
import '../../styles/spinner.scss';

interface Props {
  todo: Todo;
  handleDelete: (todo: Todo) => void;
  deletingIds: number[];
  handleToggle: (todo: Todo) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleChangeTodo: (todo: Todo, editingTitle: string) => boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  deletingIds,
  handleToggle,
  editingId,
  setEditingId,
  editingTitle,
  setEditingTitle,
  handleChangeTodo,
}) => {
  const handleOnKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const success = await handleChangeTodo(todo, editingTitle);

      if (success) {
        setEditingId(null);
      }
    }

    if (event.key === 'Escape') {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${todo.loading || deletingIds.includes(todo.id) ? 'loading' : ''}`}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-${todo.id}`}
        aria-labelledby={`todo-title-${todo.id}`}
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
          // readOnly
        />
      </label>

      {editingId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={event => setEditingTitle(event.target.value)}
          onBlur={async () => {
            const success = await handleChangeTodo(todo, editingTitle);

            if (success) {
              setEditingId(null);
            }
          }}
          onKeyDown={event => handleOnKeyDown(event)}
          autoFocus
          className="todoapp__new-todo todo__title"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
            setEditingTitle(todo.title);
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
          onClick={() => handleDelete(todo)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.loading || deletingIds.includes(todo.id) ? 'is-active' : 'hidden'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
