/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';
import cn from 'classnames';
import { deleteTodos } from '../api/todos';
import { ErrorType } from '../types/Error';

type Props = {
  todo: Todo;
  setUpdateTodoStatus: (id: number, status: boolean) => void;
  isTemp?: boolean;
  setError: (value: ErrorType, time?: number) => void;
  setDeleteItemFromTodos: (id: number) => void;
  loading: number[];
  setLoading: Dispatch<SetStateAction<number[]>>;
  onEditTodoTitle: (
    id: number,
    value: string,
    setIsEditing: Dispatch<SetStateAction<boolean>>,
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setUpdateTodoStatus,
  isTemp,
  setError,
  setDeleteItemFromTodos,
  loading,
  setLoading,
  onEditTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdited, setTitleEdited] = useState(todo.title);

  const settingStatus = async (id: number, newStatus: boolean) => {
    try {
      setLoading((prev: number[]) => [...prev, id]);
      await updateTodos(id, { completed: newStatus });
      setUpdateTodoStatus(id, newStatus);
    } catch (e) {
      setError(ErrorType.update_error, 3000);
    } finally {
      setLoading(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const onDeleteBtnHandler = async (id: number) => {
    try {
      setLoading((prev: number[]) => [...prev, id]);
      await deleteTodos(id);
      setDeleteItemFromTodos(id);
    } catch {
      setError(ErrorType.delete_error, 3000);
    } finally {
      setLoading(prev => prev.filter(todoId => todoId !== id));
    }
  };

  function keyupHandler(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', keyupHandler);

    return () => {
      document.removeEventListener('keyup', keyupHandler);
    };
  }, [isEditing]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            settingStatus(todo.id, !todo.completed);
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            onEditTodoTitle(todo.id, titleEdited, setIsEditing);
          }}
          className="todo__edit-form"
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleEdited}
            onChange={e => setTitleEdited(e.target.value)}
            onBlur={() => {
              onEditTodoTitle(todo.id, titleEdited, setIsEditing);
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteBtnHandler(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || loading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
