/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useRef } from 'react';
import { TodoError } from '../../types/TodoError';

type Props = {
  todo: Todo;
  isTodoTemp?: boolean;
  onDelete: (id: number) => void;
  processingIds: number[];
  onToggle: (todo: Todo) => void;
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
  onTitleSubmit: (todo: Todo) => void;
  setError: (error: TodoError) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTodoTemp,
  onDelete,
  processingIds,
  onToggle,
  editingTodo,
  setEditingTodo,
  newTitle,
  setNewTitle,
  onTitleSubmit,
}) => {
  const titleFieldRef = useRef<HTMLInputElement>(null);

  const shouldShowDeleteButton = !isTodoTemp && editingTodo?.id !== todo.id;

  const handleEditTodoTitle = () => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
    titleFieldRef.current?.focus();
  };

  const handleTitleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleEditFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = newTitle.trim();

    if (normalized === todo.title) {
      setEditingTodo(null);

      return;
    }

    if (normalized === '') {
      onDelete(todo.id);

      return;
    }

    onTitleSubmit(todo);
  };

  const handleOnBlur = () => {
    const normalized = newTitle.trim();

    if (normalized === todo.title) {
      setEditingTodo(null);

      return;
    }

    if (normalized === '') {
      onDelete(todo.id);

      return;
    }

    onTitleSubmit(todo);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
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
      {editingTodo?.id === todo.id ? (
        <form onSubmit={handleEditFormSubmit}>
          <input
            ref={titleFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleFieldChange}
            onBlur={handleOnBlur}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEditTodoTitle}
        >
          {todo.title}
        </span>
      )}
      {shouldShowDeleteButton && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isTodoTemp || processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
