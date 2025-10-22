/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { NotificationErrors } from '../types/Errors';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  loadingTodoId: number[] | null;
  updateTodos: (todoId: number, updates: Partial<Todo>) => Promise<Todo>;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number[] | null>>;
  setNotificationError: React.Dispatch<
    React.SetStateAction<NotificationErrors | null>
  >;
  checkboxId: string;
  todo: Todo;
  isTemp: boolean;
};

export const TodoItem: React.FC<Props> = ({
  setTodos,
  onDelete,
  onToggle,
  loadingTodoId,
  updateTodos,
  setLoadingTodoId,
  setNotificationError,
  checkboxId,
  todo,
  isTemp,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const handleDoubleClick = () => {
    if (!isTemp) {
      setIsEditing(todo.id);
      setEditedTitle(todo.title);
    }
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditedTitle('');
  };

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    setLoadingTodoId(prev => (prev ? [...prev, todo.id] : [todo.id]));

    try {
      const updatedTodo = await updateTodos(todo.id, { title: trimmedTitle });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      cancelEditing();
    } catch {
      setNotificationError(NotificationErrors.UnableToUpdate);
      setTimeout(() => setNotificationError(null), 3000);
    } finally {
      setLoadingTodoId(prev =>
        prev ? prev.filter(id => id !== todo.id) : null,
      );
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleSave();
    }

    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = async () => {
    await handleSave();
  };

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          id={checkboxId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isTemp}
        />
      </label>

      {isEditing === todo.id ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          autoFocus
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              x
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isTemp ||
          todo.isDeleting ||
          (loadingTodoId?.includes(todo.id) ?? false)
            ? 'is-active'
            : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
