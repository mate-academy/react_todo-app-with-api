/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  toDo: Todo;
  isLoading: boolean;
  handlerDeleteTodo: (id: number) => void;
  deleting: boolean;
  handleUpdateTodo: (todo: Todo) => void;
  isUpdating: boolean;
  editingId: number | null;
  setEditingId: (event: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  toDo,
  handlerDeleteTodo,
  deleting,
  handleUpdateTodo,
  isUpdating,
  editingId,
  setEditingId,
}) => {
  const [newTitle, setNewTitle] = useState(toDo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingId === toDo.id;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === toDo.title) {
      setEditingId(0);

      return;
    }

    if (!trimmedTitle) {
      handlerDeleteTodo(toDo.id);

      return;
    }

    handleUpdateTodo({ ...toDo, title: trimmedTitle });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingId(0);
      setNewTitle(toDo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: toDo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={toDo.completed}
          onChange={() =>
            handleUpdateTodo({ ...toDo, completed: !toDo.completed })
          }
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            ref={editInputRef}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            disabled={isUpdating}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingId(toDo.id)}
          >
            {toDo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handlerDeleteTodo(toDo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
