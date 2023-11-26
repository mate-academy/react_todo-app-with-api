import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (
    todoId: number,
  ) => Promise<void>,
  onUpdate: (todoId: number, data: Todo) => Promise<void>,
  areAllCompletedDeleting: boolean,
  areAllToggling: boolean,
  areAllCompleted: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  areAllCompletedDeleting,
  areAllToggling,
  areAllCompleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInputValue, setEditInputValue] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  const showLoader = isLoading
    || (areAllCompletedDeleting && todo.completed)
    || (areAllToggling && !todo.completed)
    || (areAllToggling && areAllCompleted);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const deleteTodo = () => {
    setIsLoading(true);

    onDelete(todo.id)
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (data: Todo) => {
    setIsLoading(true);

    onUpdate(todo.id, data)
      .finally(() => setIsLoading(false));
  };

  const toggleTodo = () => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  const saveTodo = () => {
    const trimmedValue = editInputValue.trim();

    if (trimmedValue === todo.title) {
      setEditInputValue(trimmedValue);

      return;
    }

    if (!trimmedValue) {
      deleteTodo();

      return;
    }

    updateTodo({ ...todo, title: trimmedValue });
    setEditInputValue(trimmedValue);
  };

  const handleEditingFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveTodo();
    setIsEditing(false);
  };

  const handleEditInputKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditInputValue(todo.title);
      setIsEditing(false);
    }
  };

  const handleEditInputBlur = () => {
    saveTodo();
    setIsEditing(false);
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <div
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleEditingFormSubmit}
        >
          <input
            ref={editInputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editInputValue}
            onChange={e => setEditInputValue(e.target.value)}
            onBlur={handleEditInputBlur}
            onKeyUp={handleEditInputKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
