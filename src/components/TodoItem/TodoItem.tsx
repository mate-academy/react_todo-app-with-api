import { useEffect, useState, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/';

type Props = {
  todo: Todo;
  title: string;
  setTitle: (el: string) => void;
  isLoading: boolean;
  onUpdateStatus: (todo: Todo) => Promise<void>;
  // onDelete: (id: number) => Promise<void>;
  deletedId: number | null;
  setDeletedId: (id: number) => void;
  removeTodo: (id: number) => void;
  onToggleStatus: (todo: Todo) => Promise<void>;
  el: Todo;
  loadingTodoIds: number[];
  ErrorMessages: { None: string; Delete: string; Update: string };
  setErrorMessage: (msg: string) => void;
  setIsError: (err: boolean) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  title,
  setTitle,
  isLoading,
  onUpdateTitle,
  removeTodo,
  deletedId,
  setDeletedId,
  onToggleStatus,
  loadingTodoIds,
  ErrorMessages,
  setErrorMessage,
  setIsError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isThisTodoLoading =
    loadingTodoIds.includes(todo.id) ||
    todo.id === deletedId ||
    isLoading ||
    isUpdating;

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setDeletedId(todo.id);
      removeTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      setIsUpdating(true);
      await onUpdateTitle(todo, trimmedTitle);
      setIsEditing(false);
    } catch {
      setErrorMessage(ErrorMessages.Update);
      setIsError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={`todo__status ${todo.completed ? 'completed' : ''}`}
          checked={todo.completed}
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            onToggleStatus(todo);
          }}
          onDoubleClick={() => {
            setIsEditing(true);
          }}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          value={newTitle}
          id="TodoTitleField"
          type="text"
          className="todo__title-field"
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          ref={editInputRef}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          id="todo-title"
          onDoubleClick={() => {
            setIsEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      {isEditing ? (
        ''
      ) : (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            setDeletedId(todo.id);
            removeTodo(todo.id);
          }}
        >
          ×
        </button>
      )}
      <Loader isLoading={isThisTodoLoading} />
    </div>
  );
};
