import React, { useCallback, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onSubmitEdited: (id: number, newTitle: string) => void;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  loadingTodoId,
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
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onEditTodo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoEditText(event.target.value.trim());
    }, [],
  );

  const onChooseTodoToEdit = useCallback(
    (todoId: number) => {
      setEditTodoId(todoId);
      setTodoEditText(title);
    }, [title],
  );

  const handleSubmitEdited = useCallback(() => {
    if (todoEditText) {
      onSubmitEdited(id, todoEditText);
    } else {
      onDelete(id);
    }

    setEditTodoId(null);
  }, [id, todoEditText, onSubmitEdited, onDelete]);

  const handleEscape = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditTodoId(null);
      }
    }, [],
  );

  useEffect(() => {
    if (editTodoId === id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTodoId, id]);

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

      {editTodoId === id ? (
        <form
          onSubmit={handleSubmitEdited}
          onBlur={handleSubmitEdited}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoEditText}
            onChange={onEditTodo}
            onKeyUp={handleEscape}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => onChooseTodoToEdit(id)}
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
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
