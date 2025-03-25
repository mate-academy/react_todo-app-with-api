/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isLoadingDefault?: boolean;
  loadingTodos?: Set<number>;
  removeTodo?: (id: number) => void;
  updateTodoTitle?: (id: number, updatedTitle: string) => void;
  showErrorMessage?: (message: string, delay?: number) => void;
  toggleTodoStatus?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoadingDefault = false,
  loadingTodos,
  removeTodo = (): void => {},
  updateTodoTitle = (): void => {},
  showErrorMessage = (): void => {},
  toggleTodoStatus = (): void => {},
}) => {
  const isLoadingTodo = () => {
    if (isLoadingDefault) {
      return true;
    }

    if (loadingTodos?.has(todo.id)) {
      return true;
    }

    return false;
  };

  const [isLoading, setIsLoading] = useState(isLoadingTodo());
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const todoRef = useRef<HTMLInputElement>(null);

  const handlerDelete = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        removeTodo(todo.id);
        setIsEditing(false);
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handlerCompleteToggle = () => {
    setIsLoading(true);

    updateTodo(todo.id, {
      userId: todo.userId,
      completed: !isCompleted,
    })
      .then(() => {
        setIsCompleted(!isCompleted);
        toggleTodoStatus(todo.id);
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerEdit = () => {
    setIsEditing(true);
  };

  const handlerSubmitUpdatedTitle = (
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();

    if (updatedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (updatedTitle === '') {
      handlerDelete();

      return;
    }

    setIsLoading(true);

    updateTodo(todo.id, {
      userId: todo.userId,
      title: updatedTitle,
    })
      .then(() => {
        updateTodoTitle(todo.id, updatedTitle.trim());
        setIsEditing(false);
      })
      .catch(() => showErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (loadingTodos) {
      setIsLoading(loadingTodos.has(todo.id));
    }
  }, [loadingTodos, todo.id]);

  useEffect(() => {
    setIsCompleted(todo.completed);
  }, [todo]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUpdatedTitle(todo.title);
        setIsEditing(false);
      }
    };

    if (todoRef.current) {
      todoRef.current.focus();
    }

    const ref = todoRef.current;

    if (ref) {
      ref.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      if (ref) {
        ref.removeEventListener('keydown', handleEscapeKey);
      }
    };
  }, [isEditing, todo.title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isCompleted })}
    >
      <>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={handlerCompleteToggle}
          />
        </label>

        {!isEditing && (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handlerEdit}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handlerDelete}
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

        {isEditing && (
          <form onSubmit={handlerSubmitUpdatedTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onChange={e => setUpdatedTitle(e.target.value)}
              value={updatedTitle}
              ref={todoRef}
              onBlur={e => e.target.form?.requestSubmit()}
            />
          </form>
        )}
      </>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
