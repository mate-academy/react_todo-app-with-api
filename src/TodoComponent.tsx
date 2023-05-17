import React, {
  useCallback, useState, useRef, useEffect, memo,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onSubmitEdited: (id: number, newTitle: string) => void;
};

export const TodoComponent: React.FC<Props> = memo(({
  todo,
  loadingTodoIds,
  onDelete,
  onChangeStatus,
  onSubmitEdited,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [todoEditText, setTodoEditText] = useState('');
  const [isTodoEditing, setIsTodoEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditTodo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoEditText(event.target.value.trim());
    }, [],
  );

  const handleChooseTodoToEdit = useCallback(
    () => {
      setIsTodoEditing(true);
      setTodoEditText(title);
    }, [title],
  );

  const handleSubmitEdited = useCallback(() => {
    if (todoEditText) {
      onSubmitEdited(id, todoEditText);
    } else {
      onDelete(id);
    }

    setIsTodoEditing(false);
  }, [id, todoEditText, onSubmitEdited, onDelete]);

  const handleEscape = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsTodoEditing(false);
      }
    }, [],
  );

  useEffect(() => {
    if (isTodoEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTodoEditing, id]);

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChangeStatus(id, !completed)}
        />
      </label>

      {isTodoEditing ? (
        <form
          onSubmit={handleSubmitEdited}
          onBlur={handleSubmitEdited}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoEditText}
            onChange={handleEditTodo}
            onKeyUp={handleEscape}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleChooseTodoToEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
