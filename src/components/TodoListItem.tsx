import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  deletingIds: number[],
  onToggle: (todoId: number) => void,
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  areSubmiting: boolean,
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  onDelete,
  deletingIds,
  onToggle,
  togglingId,
  onUpdate,
  areSubmiting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTodoTitleChange = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const currentTodoTitle = todo.title;

    if (newTodoTitle === currentTodoTitle) {
      setIsEditing(false);
    } else if (newTodoTitle.trim() === '') {
      onDelete(todo.id);
    } else {
      setIsEditing(true);
      client
        .patch(`/todos/${todo.id}`, { title: newTodoTitle })
        .then(() => {
          setIsEditing(false);
          onUpdate(todo.id, { ...todo, title: newTodoTitle });
        })
        .catch(() => {
          setIsEditing(false);
          onUpdate(todo.id, todo);
        });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onToggle(todo.id)}
          onChange={() => onUpdate(todo.id, todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="todoapp__new-todo todoapp__new-todo--edit-title"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            onBlur={handleFormSubmit}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={handleTodoTitleChange}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
        disabled={deletingIds.includes(todo.id)
          || togglingId === todo.id
          || areSubmiting}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': deletingIds.includes(todo.id)
            || togglingId === todo.id
            || areSubmiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
