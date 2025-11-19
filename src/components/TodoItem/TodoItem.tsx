import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onRemove?: (todoId: number) => void;
  onUpdateStatus?: (todo: Todo) => void;
  editingTodoId?: number | null;
  setEditId?: (id: number | null) => void;
  onChangeTitle?: (todo: Todo) => Promise<void>;
}

export const TodoItem: FC<Props> = React.memo(function TodoItem({
  todo,
  isLoading = false,
  onRemove = () => {},
  onUpdateStatus = () => {},
  editingTodoId = null,
  setEditId = () => {},
  onChangeTitle = async () => {},
}) {
  const [titleValue, setTitleValue] = useState(todo.title);
  const todoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingTodoId === todo.id;

  useEffect(() => {
    const todoItem = todoRef.current;

    const handlDbClick = (event: MouseEvent) => {
      event.preventDefault();

      setEditId(todo.id);
    };

    if (todoItem) {
      todoItem.addEventListener('dblclick', handlDbClick);
    }

    return () => {
      if (todoItem) {
        todoItem.removeEventListener('dblclick', handlDbClick);
      }
    };
  }, [todo.id, setEditId]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleEscClick = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTitleValue(todo.title);
        setEditId(null);
      }
    };

    document.addEventListener('keyup', handleEscClick);

    return () => {
      document.removeEventListener('keyup', handleEscClick);
    };
  }, [setEditId, isEditing, todo.title]);

  const handleRemove = useCallback(() => {
    onRemove(todo.id);
  }, [onRemove, todo.id]);

  const handleChangeStatus = useCallback(() => {
    onUpdateStatus(todo);
  }, [onUpdateStatus, todo]);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitleValue(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const newTitle = titleValue.trim();

    if (newTitle === todo.title) {
      setEditId(null);

      return;
    }

    if (newTitle === '') {
      onRemove(todo.id);

      return;
    }

    onChangeTitle({
      id: todo.id,
      title: newTitle,
      completed: todo.completed,
      userId: todo.userId,
    }).then(() => setEditId(null));
  }, [
    titleValue,
    todo.title,
    setEditId,
    onRemove,
    onChangeTitle,
    todo.id,
    todo.completed,
    todo.userId,
  ]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      ref={todoRef}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {editingTodoId !== todo.id ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();

            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleValue}
            onChange={handleChangeTitle}
            onBlur={handleSubmit}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        {/*eslint-disable-next-line max-len*/}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
