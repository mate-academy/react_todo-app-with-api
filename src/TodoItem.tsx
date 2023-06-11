import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: () => void;
  isLoading: boolean,
  updatingTodoIds: number[],
  handleStatusChange: (id: number) => Promise<void>,
  handleTitleChange: (id: number, title: string) => Promise<void>,
}

export const TodoItem = (
  {
    todo, onDelete, isLoading, updatingTodoIds,
    handleStatusChange, handleTitleChange,
  }: TodoItemProps,
) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [changedTitle, setChangedTitle] = useState('');
  const changingTitle = useRef<HTMLInputElement>(null);

  const changeTitle = (event: React.FormEvent) => {
    event.preventDefault();

    if (editedTodoId && changedTitle.trim().length > 0) {
      handleTitleChange(editedTodoId, changedTitle.trim());
      setEditedTodoId(null);
      setChangedTitle('');
    }

    if (editedTodoId && changedTitle.trim().length === 0) {
      handleTitleChange(editedTodoId, changedTitle.trim());
      setEditedTodoId(null);
      setChangedTitle('');
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setChangedTitle('');
    }
  };

  useEffect(() => {
    if (changingTitle.current && editedTodoId) {
      changingTitle.current.focus();
    }

    if (changingTitle.current && !editedTodoId) {
      changingTitle.current?.blur();
    }
  }, [editedTodoId]);

  return (
    <div
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleStatusChange(todo.id);
          }}
        />
      </label>
      {editedTodoId === todo.id ? (
        <form onSubmit={changeTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={(event) => setChangedTitle(event.target.value)}
            onBlur={changeTitle}
            onKeyUp={handleKeyUp}
            ref={changingTitle}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setEditedTodoId(todo.id);
              setChangedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={onDelete}
          >
            ×
          </button>
        </>

      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading && updatingTodoIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
