import { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';

type TodoItemProps = {
  todo: Todo;
  addingTodoId: number | null;
  setAddingTodoId: (id: number | null) => void;
  handleDelete: (id: number) => void;
  handleToggle: (id: number) => void;
  handleUpdate: (updatedTodo: Todo) => void;
  setError: (error: string) => void;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  updatingTodoId: number | null;
  setUpdatingTodoId: (updatingTodoId: number | null) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  addingTodoId,
  setAddingTodoId,
  handleDelete,
  handleToggle,
  setError,
  handleUpdate,
  isUpdating,
  setIsUpdating,
  updatingTodoId,
  setUpdatingTodoId,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const { title, completed, id } = todo;

  const editInputRef = useRef<HTMLInputElement>(null);

  const onDeleteClick = useCallback(() => {
    if (typeof id === 'number') {
      setAddingTodoId(id);
      deleteTodo(id)
        .then(() => handleDelete(id))
        .catch(() => {
          setError('Unable to delete a todo');
          setAddingTodoId(null);
        });
    }
  }, [id, setAddingTodoId, handleDelete, setError]);

  const onDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEdit = () => {
    if (typeof id === 'undefined') {
      return;
    }

    const updatedTodo = { ...todo };

    switch (editTitle.trim()) {
      case todo.title:
        setIsEditing(false);
        break;
      case '':
        onDeleteClick();
        break;
      default:
        updatedTodo.title = editTitle.trim();

        setIsUpdating(true);
        setUpdatingTodoId(id);

        updateTodo(updatedTodo)
          .then(() => {
            setIsEditing(false);
            handleUpdate(updatedTodo);
          })
          .catch(() => {
            setError('Unable to update a todo');
            editInputRef.current?.focus();
          })
          .finally(() => {
            setIsUpdating(false);
            setUpdatingTodoId(null);
          });
    }
  };

  const handleEditFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
  };

  const handleEditControls = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Escape') {
      return;
    }

    setEditTitle(todo.title);
    setIsEditing(false);
  };

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditTitle(todo.title);
  }, [todo.title]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => id && handleToggle(id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleEdit}
            onKeyUp={handleEditControls}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClick}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDeleteClick}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            id === addingTodoId || (isUpdating && id === updatingTodoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
