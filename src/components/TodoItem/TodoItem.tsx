import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Loader } from '../Loader/Loader';

type Props = {
  isHover: boolean;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
  todo: Todo;
  setUpdatingTodoId: React.Dispatch<SetStateAction<number>>;
  handleToggle: (id: number) => void;
  updatingTodoId: number | null;
  isTempTodo: boolean;
  setIsEditingId: React.Dispatch<SetStateAction<number | null>>;
  isEditingId: number | null;
  handleUpdateTitle: (id: number, newTitle: string) => void;
  isTogglleAll: boolean;
};

export const TodoItem: React.FC<Props> = ({
  isHover,
  deletedTodoId,
  setIsHover,
  handleDelete,
  todo: { id, title, completed },
  setUpdatingTodoId,
  handleToggle,
  updatingTodoId,
  isTempTodo,
  setIsEditingId,
  isEditingId,
  handleUpdateTitle,
  isTogglleAll,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef(null);
  const [originTitle, setOriginTitle] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditingId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditingId === id) {
        setIsEditingId(null);
        setNewTitle(originTitle);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditingId, id, originTitle]);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      data-cy="Todo"
      key={id}
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
          onClick={() => {
            setUpdatingTodoId(id);
            handleToggle(id);
          }}
          checked={completed}
        />

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': updatingTodoId === id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </label>

      {isEditingId !== id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            event?.preventDefault();
            setIsEditingId(id);
            setOriginTitle(title);
          }}
        >
          {newTitle.trim()}
        </span>
      )}
      {isEditingId === id && (
        <form
          onSubmit={async event => {
            event.preventDefault();

            try {
              if (newTitle.trim() === originTitle) {
                setIsEditingId(null);
                setNewTitle(originTitle);

                return;
              }

              setIsUpdating(true);

              await handleUpdateTitle(isEditingId, newTitle);
              setIsEditingId(null);
            } catch {
              setIsEditingId(id);
            } finally {
              setIsUpdating(false);
            }
          }}
          onBlur={async event => {
            event.preventDefault();

            try {
              if (newTitle.trim() === originTitle) {
                setIsEditingId(null);
                setNewTitle(originTitle);

                return;
              }

              setIsUpdating(true);

              await handleUpdateTitle(isEditingId, newTitle);
              setIsEditingId(null);
            } catch {
              setIsEditingId(id);
            } finally {
              setIsUpdating(false);
            }
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            onChange={e => {
              setNewTitle(e.target.value);
            }}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
          />
          <Loader isActive={isUpdating} />
        </form>
      )}

      {isEditingId !== id && (
        <button
          type="button"
          className={classNames('todo__remove', {
            'is-active': !isHover,
          })}
          data-cy="TodoDelete"
          onClick={() => {
            handleDelete(id);
          }}
        >
          ×
        </button>
      )}

      <Loader isActive={isTempTodo || deletedTodoId === id || isTogglleAll} />
    </div>
  );
};
