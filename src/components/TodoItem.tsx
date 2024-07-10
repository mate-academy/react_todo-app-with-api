import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todoId: number;
  todoTitle: string;
  isCompleted: boolean;
  handleTodoClick: (id: number) => void;
  deleteTodos: (id: number) => Promise<void>;
  isSubmitting: Todo | null;
  deletingTodo: number;
  currentTodos: number[];
  handleEdit: (id: number, newTitle: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todoId,
  todoTitle,
  isCompleted,
  handleTodoClick,
  deleteTodos,
  isSubmitting,
  deletingTodo,
  currentTodos,
  handleEdit,
}) => {
  const [editTitle, setEditTitle] = useState(todoTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const id = currentTodos.find(currentId => currentId === todoId);

  const handleChange =
    isSubmitting?.id === todoId || deletingTodo === todoId || id || hasError;

  const itemRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (itemRef.current !== null) {
      itemRef.current.focus();
    }
  }, [isEditing]);

  function save() {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todoTitle) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle) {
      handleEdit(todoId, trimmedTitle)
        .then(() => setIsEditing(false))
        .catch(() => {
          setIsEditing(true);
          itemRef.current?.focus();
        });
    } else {
      deleteTodos(todoId)
        .then(() => setIsEditing(false))
        .catch(() => {
          setIsEditing(true);
          itemRef.current?.focus();
          setHasError(false);
        })
        .finally(() => setHasError(false));
    }

    setIsEditing(false);
  }

  const handleKey = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    save();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      save();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: isCompleted,
        'temp-item-enter temp-item-enter-active': id === 0,
      })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${todoId}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-${todoId}`}
          checked={isCompleted}
          onChange={() => handleTodoClick(todoId)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleKey}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            id={`todo-${todoId}`}
            value={editTitle}
            ref={itemRef}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={save}
            onKeyUp={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title" ref={itemRef}>
            {todoTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodos(todoId)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': handleChange,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
