import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  deleteItem: (id: number) => void;
  isLoading: boolean;
  isComplete: (obj: Todo) => void;
  isChange: (obj: Todo) => Promise<void>;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  deleteItem,
  isLoading,
  isComplete,
  isChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);
  const isCancelledRef = useRef<boolean>(false);

  const handleSubmit = () => {
    const normalizedTitle = editingTitle.trim();

    if (!normalizedTitle) {
      deleteItem(todo.id);

      return;
    }

    if (normalizedTitle !== todo.title) {
      isChange({ ...todo, title: editingTitle.trim() })
        .then(() => setIsEditing(false))
        .catch(() => editInputRef.current?.focus());
    }

    if (normalizedTitle === todo.title) {
      setIsEditing(false);
    }
  };

  const submitOnBlur = () => {
    if (!isCancelledRef.current) {
      handleSubmit();
    }

    isCancelledRef.current = false;
  };

  const cancelSubmit = (eventKey: string) => {
    if (eventKey === 'Escape') {
      setIsEditing(false);
      setEditingTitle(todo.title);
      isCancelledRef.current = true;
    }
  };

  useEffect(() => {
    editInputRef.current?.focus();
  }, [isEditing]);


  return (
    /* eslint-disable jsx-a11y/label-has-associated-control */
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
          onChange={() => isComplete(todo)}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteItem(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            ref={editInputRef}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={submitOnBlur}
            onKeyUp={e => cancelSubmit(e.key)}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
