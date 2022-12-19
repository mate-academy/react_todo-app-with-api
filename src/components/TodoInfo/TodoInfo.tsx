import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  deleteCurrentTodo: (todoId: number) => void;
  todoIdsToDelete: number[],
  todoIdsToUpdate: number[],
  onStatusUpdate: (todoId: number, completed: boolean) => void,
  onTitleUpdate: (todoId: number, newTitle: string) => void,
}

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  deleteCurrentTodo,
  todoIdsToDelete,
  todoIdsToUpdate,
  onStatusUpdate,
  onTitleUpdate,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [isSelected, setIsSelected] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const isActiveCheck = useMemo(() => todoIdsToUpdate.includes(id)
    || todoIdsToDelete.includes(id), [todoIdsToUpdate, todoIdsToDelete]);

  const focusTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTitle.current) {
      focusTitle.current.focus();
    }
  }, [isSelected]);

  const updatingTitle = useCallback(() => {
    if (newTitle.trim() === title) {
      setIsSelected(false);

      return;
    }

    if (newTitle.trim() === '') {
      deleteCurrentTodo(id);

      return;
    }

    onTitleUpdate(id, newTitle);

    setIsSelected(false);
  }, [newTitle, title]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event?.preventDefault();

    updatingTitle();
  }, [newTitle, title]);

  const handleOnBlur = useCallback(() => updatingTitle(), [newTitle, title]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsSelected(false);
    }
  }, [title]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onStatusUpdate(id, !completed)}
        />
      </label>

      {isSelected ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={focusTitle}
            className="todo__title-field"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsSelected(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteCurrentTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isActiveCheck },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
