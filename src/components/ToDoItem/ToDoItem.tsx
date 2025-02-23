/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useState,
  KeyboardEvent,
  useRef,
  FormEvent,
  useEffect,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onUpdate: (
    id: number,
    updatedTodo: Partial<Todo>,
    onSuccess?: () => void,
    onFail?: () => void,
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isTempToDo?: boolean;
  isAllLoading: boolean;
}

export const ToDoItem: React.FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  isTempToDo = false,
  isAllLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== document.activeElement) {
      inputRef.current?.focus();
    }
  }, [isEditing, hasChanges]);

  const handleSave = () => {
    const trimmedValue = inputRef.current?.value.trim();

    if (trimmedValue === todo.title) {
      return setIsEditing(false);
    }

    setIsLoading(true);

    setHasChanges(true);
    if (trimmedValue !== '') {
      onUpdate(todo.id, { title: trimmedValue }, () =>
        setIsEditing(false),
      ).finally(() => {
        setIsLoading(false);
        setHasChanges(false);
      });
    } else {
      onDelete(todo.id).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      handleSave();
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    onDelete(todo.id).finally(() => setIsLoading(false));
  };

  const handleStatusChange = () => {
    setIsLoading(true);
    onUpdate(todo.id, { completed: !todo.completed }).finally(() =>
      setIsLoading(false),
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={handleSave}
            ref={inputRef}
            defaultValue={todo.title}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            <label>{todo.title}</label>
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isTempToDo || isLoading || isAllLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
