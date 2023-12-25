import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useTodosContext } from '../store';
import { apiClient } from '../../api/todos';
import { ErrorOption } from '../../enum/ErrorOption';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setError,
    removeTodo,
    deletingTodoIds,
    updateTodoTitle,
    toggleTodoCondition,
  } = useTodosContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(todo.title);

  const isDeleting = deletingTodoIds.includes(todo.id);

  const loaderCondition = isDeleting || isLoading || todo.id === 0;

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handlerDeleteTodo = async (todoId: number) => {
    setIsLoading(true);

    try {
      await apiClient.deleteTodo(todoId);
      removeTodo(todoId);
    } catch (error) {
      setError(ErrorOption.DeleteTodoError);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerUpdateTodo = async () => {
    const cachedTitle = todo.title;

    try {
      if (editingValue.trim() === '') {
        setIsEditing(false);
        await handlerDeleteTodo(todo.id);

        return;
      }

      if (editingValue.trim() === cachedTitle) {
        setIsEditing(false);

        return;
      }

      setIsLoading(true);
      setIsEditing(false);

      updateTodoTitle(todo.id, editingValue);

      await apiClient.updateTodo(todo.id, {
        ...todo,
        title: editingValue,
      });
    } catch (error) {
      updateTodoTitle(todo.id, cachedTitle);
      setError(ErrorOption.UpdateTodoError);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handlerUpdateTodo();
  };

  const handlerChangeCheckbox = () => {
    setIsLoading(true);
    toggleTodoCondition(todo.id, setIsLoading);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingValue(todo.title);
      setIsEditing(false);
    }
  };

  const onBlur = () => {
    handlerUpdateTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handlerChangeCheckbox}
        />
      </label>

      {isEditing && (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingValue}
            onChange={(event) => setEditingValue(event.target.value)}
            ref={inputRef}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
          />
        </form>
      )}

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {isHovered && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handlerDeleteTodo(todo.id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loaderCondition,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
