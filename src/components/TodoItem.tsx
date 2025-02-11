import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number[]) => void;
  onUpdate?: (todoDataUpdate: [Todo]) => Promise<Todo | null>[];
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate = () => [],
  isLoading,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [hasEditTitleFocus, setHasEditTitleFocus] = useState(false);
  const titleEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleEditRef.current?.focus();
  }, [hasEditTitleFocus]);

  const handleTodoUpdate = () => {
    const formattedEditTitle = editTitle.trim();

    if (!formattedEditTitle) {
      onDelete([todo.id]);

      return;
    }

    if (formattedEditTitle !== todo.title) {
      setEditTitle(formattedEditTitle);
      setHasEditTitleFocus(false);

      const preparedEditTodoUpdate = { ...todo, title: formattedEditTitle };

      onUpdate([preparedEditTodoUpdate]).forEach(promise => {
        promise.then(response => {
          if (!response) {
            setHasEditTitleFocus(true);
          }
        });
      });
    } else {
      setEditTitle(todo.title);
      setHasEditTitleFocus(false);
    }
  };

  const handleEditTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleTodoUpdate();
  };

  const handleTodoToggle = () => {
    const preparedToggleTodoUpdate = { ...todo, completed: !todo.completed };

    onUpdate([preparedToggleTodoUpdate]);
  };

  const handleTodoKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setHasEditTitleFocus(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoToggle}
        />
      </label>

      {hasEditTitleFocus ? (
        <form onSubmit={handleEditTodoSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleEditRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleTodoUpdate}
            onKeyUp={handleTodoKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setHasEditTitleFocus(true)}
          >
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([todo.id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
