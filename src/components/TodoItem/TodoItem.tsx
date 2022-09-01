/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  FC, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo, UpdateTodoFragment } from '../../types/Todo';

interface Props {
  todo: Todo;
  onChange: (value: number, field: UpdateTodoFragment) => void;
  onDelete: (todoId: number) => void;
  loading: boolean;
  currentTodoId: number | null;
  setCurrentTodoId: (todoId: number) => void;

}

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    onChange,
    onDelete,
    loading,
    currentTodoId,
    setCurrentTodoId,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const editTodoField = useRef<HTMLInputElement>(null);

  const preparedTodoTitle = useMemo(() => {
    return newTodoTitle.trim();
  }, [newTodoTitle]);

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setCurrentTodoId(todo.id);

    if (todo.title === preparedTodoTitle) {
      setIsEditing(false);
    }

    if (isEditing
      && todo.title !== preparedTodoTitle
      && preparedTodoTitle !== ''
    ) {
      onChange(todo.id, { title: preparedTodoTitle });
      setIsEditing(false);
    }

    if (isEditing && preparedTodoTitle === '') {
      onDelete(todo.id);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  window.console.log('todoItemId', currentTodoId);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onChange(todo.id, { completed: !todo.completed })}
          checked={todo.completed}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title todo__title--input"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              ref={editTodoField}
            />

          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loading && todo.id === currentTodoId,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}

    </div>
  );
};
