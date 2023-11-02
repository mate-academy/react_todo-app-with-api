/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { DispatchContext, StateContext } from '../states/Global';

interface Props {
  todo: Todo
}

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
  const { todosToProcess } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const { id: todoId, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editInput = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim() !== title) {
      setIsLoading(true);

      if (newTitle.trim()) {
        updateTodo({ ...todo, title: newTitle.trim() }, dispatch)
          .catch(() => setIsEditing(true))
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        deleteTodo(dispatch, todoId)
          .finally(() => {
            setIsLoading(false);
          });
      }
    }

    setIsEditing(false);
  }, [dispatch, newTitle, title, todo, todoId]);

  const handleDelete = useCallback(() => {
    setIsLoading(true);

    deleteTodo(dispatch, todoId)
      .finally(() => setIsLoading(false));
  }, [dispatch, todoId]);

  const handleCheck = useCallback(() => {
    setIsLoading(true);

    updateTodo({ ...todo, completed: !todo.completed }, dispatch)
      .finally(() => setIsLoading(false));
  }, [dispatch, todo]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(title);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [title]);

  useEffect(() => {
    if (todosToProcess.some((todoToProcess) => todoToProcess.id === todoId)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todoId, todosToProcess]);

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

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
          checked={completed}
          onChange={handleCheck}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              { title }
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInput}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleSubmit}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
