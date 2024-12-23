/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { updateTodoTitle, USER_ID } from '../api/todos';
import { pause } from '../utils/methods';

interface Props {
  todo: Todo;
  onUpdate?: (v: Todo) => void;
  onDelete?: (n: number) => void;
  loader: boolean;
  onLoader?: (v: boolean) => void;
  massLoader?: boolean;
  tempTodo?: Todo | null;
  onErrorMessage?: (v: string) => void;
  onTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onUpdate = () => {},
  onDelete = () => {},
  loader,
  onLoader = () => {},
  massLoader = false,
  tempTodo = null,
  onErrorMessage = () => {},
  onTodos = () => {},
}) => {
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(title);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const handleChangeDblClick = () => {
    setIsEditing(true);
  };

  const handleKeyUpEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const span = spanRef.current;

    if (span) {
      span.addEventListener('dblclick', handleChangeDblClick);
    }

    if (isEditing) {
      document.addEventListener('keyup', handleKeyUpEscape);
    }

    return () => {
      span?.removeEventListener('dblclick', handleChangeDblClick);
      document.removeEventListener('keyup', handleChangeDblClick);
    };
  }, [isEditing]);

  const handleChangeCheckbox = async () => {
    setActiveTodoId(id);
    await onUpdate({
      id,
      userId: USER_ID,
      title,
      completed: !completed,
    });
    setActiveTodoId(null);
  };

  const handleDelete = async () => {
    try {
      setActiveTodoId(id);

      await onDelete(id);
    } catch {
      setActiveTodoId(null);
      onErrorMessage('Unable to delete a todo');
    }
  };

  const handleUpdateFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!updateTitle) {
      handleDelete();

      return;
    }

    if (updateTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    const updatedTodo = {
      id,
      title: updateTitle.trim(),
    };

    try {
      onLoader(true);
      setActiveTodoId(id);

      await pause();
      const newTodo = await updateTodoTitle(updatedTodo);

      onTodos(prev =>
        prev.map(todo =>
          todo.id === newTodo.id ? { ...todo, ...newTodo } : todo,
        ),
      );
      setIsEditing(false);
    } catch {
      onErrorMessage('Unable to update a todo');
    } finally {
      onLoader(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCheckbox}
        />
      </label>

      {isEditing && (
        <form onSubmit={handleUpdateFormSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todoapp__update-todo"
            value={updateTitle}
            autoFocus
            onChange={e => setUpdateTitle(e.target.value)}
            onBlur={handleUpdateFormSubmit}
          />
        </form>
      )}

      {!isEditing && (
        <span data-cy="TodoTitle" className="todo__title" ref={spanRef}>
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (loader && activeTodoId === id) || massLoader || tempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
