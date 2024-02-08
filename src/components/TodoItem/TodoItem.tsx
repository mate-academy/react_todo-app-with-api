import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (todoId: number) => void,
  loadingTodoIds: number[],
  handleChangeTodo?: (todo: Todo) => void,
  handleRenameTodo?: (todo: Todo, title: string) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => { },
  loadingTodoIds,
  handleChangeTodo = () => { },
  handleRenameTodo = () => { },
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isTodoEditing]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === newTitle) {
      setIsTodoEditing(false);

      return;
    }

    if (!newTitle.trim()) {
      onDelete(id);

      return;
    }

    try {
      await handleRenameTodo(todo, newTitle);

      setIsTodoEditing(false);
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleChangeTodo(todo)}
          checked={completed}
        />
      </label>

      {isTodoEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.currentTarget.value)}
            ref={inputRef}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsTodoEditing(false);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsTodoEditing(true);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': loadingTodoIds?.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
