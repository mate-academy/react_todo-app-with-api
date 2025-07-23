import { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { UpdateTodo } from '../../types/UpdateTodo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (todoId: number) => void;
  handleUpdate: (
    todo: Todo,
    updateType: UpdateTodo,
    title?: string,
  ) => Promise<void>;
  isBeingEdited: boolean;
  setEditingTodoId: (id: number | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDelete,
  handleUpdate,
  isBeingEdited,
  setEditingTodoId,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isBeingEdited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBeingEdited]);

  const finishEditing = () => {
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimmedTitle) {
      handleDelete(todo.id);

      return;
    }

    handleUpdate(todo, UpdateTodo.Title, trimmedTitle)
      .then(() => setEditingTodoId(null))
      .catch(() => {});
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUpdatedTitle(todo.title);
      setEditingTodoId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finishEditing();
  };

  return (
    <div
      data-cy="Todo"
      className={'todo' + (todo.completed ? ' completed' : '')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Toggle todo status"
          checked={todo.completed}
          onChange={() => handleUpdate(todo, UpdateTodo.Status)}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={e => setUpdatedTitle(e.target.value)}
            onBlur={finishEditing}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      )}

      {!isBeingEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={'modal overlay' + (isLoading ? ' is-active' : '')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
