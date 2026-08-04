/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  isLoading?: boolean;
  handleDelete?: (id: number) => void;
  handleToggle?: (todoId: number) => Promise<void>;
  isUpdating?: boolean;
  editingTodoId?: number | null;
  setEditingTodoId?: React.Dispatch<React.SetStateAction<number | null>>;
  handleRename?: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem = ({
  todo,
  isLoading = false,
  handleDelete,
  handleToggle,
  isUpdating,
  editingTodoId,
  setEditingTodoId,
  handleRename,
}: TodoItemProps) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const renameTodo = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId?.(null);

      return;
    }

    if (!trimmedTitle) {
      handleDelete?.(todo.id);

      return;
    }

    await handleRename?.(todo.id, trimmedTitle);
  };

  const handleRenameSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await renameTodo();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId?.(null);
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
          onChange={() => handleToggle?.(todo.id)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form onSubmit={handleRenameSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={renameTodo}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditedTitle(todo.title);
            setEditingTodoId?.(todo.id);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={
          isLoading || isUpdating ? 'modal overlay is-active' : 'modal overlay'
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
