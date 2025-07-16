import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
  updatingTodoIds: number[];
  onDelete: (todoId: number) => void;
  disabled: boolean;
  onRename: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  updatingTodoIds,
  onDelete,
  onRename,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = editedTitle.trim();

    inputRef.current?.focus();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onRename(todo.id, trimmedTitle);
    setIsEditing(false);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={`todo ${todo.completed && `completed`}`}
        key={todo.id}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
          />
        </label>

        {!isEditing && (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick()}
          >
            {todo.title}
          </span>
        )}

        {isEditing && (
          <form onSubmit={handleSubmitEdit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={handleSubmitEdit}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  handleSubmitEdit(e);
                  setIsEditing(false);
                } else if (e.key === 'Escape') {
                  setEditedTitle(todo.title);
                  setIsEditing(false);
                }
              }}
            />
          </form>
        )}

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <TodoLoader todoId={todo.id} updatingTodoIds={updatingTodoIds} />
      </div>
    </>
  );
};
