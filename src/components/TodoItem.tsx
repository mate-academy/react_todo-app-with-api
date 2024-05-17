/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Action, ActionNames, errors } from './TodoContext';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  loading: boolean;
  dispatch: (action: Action) => void;
  handleError: (message: string) => void;
  onDelete: (ids: number[]) => void;
  isLoadingAll: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  dispatch,
  handleError,
  isLoadingAll,
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [isEditing, setIsEdinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === inputValue.trim()) {
      setIsEdinting(false);

      return;
    }

    setIsLoading(true);
    if (!inputValue.trim()) {
      onDelete([todo.id]);
    } else {
      updateTodo({
        ...todo,
        title: inputValue,
      })
        .then(updatedTodo => {
          dispatch({
            type: ActionNames.Update,
            payload: { id: updatedTodo.id, title: updatedTodo.title },
          });
          setIsEdinting(false);
        })
        .catch(() => {
          handleError(errors.UpdateTodo);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdinting(false);
      setInputValue(todo.title);
    }
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      onDelete([todo.id]);
    } else if (inputValue) {
      setIsLoading(true);
      setIsEdinting(false);

      updateTodo({
        ...todo,
        title: inputValue,
      })
        .then(updatedTodo => {
          dispatch({
            type: ActionNames.Update,
            payload: { id: updatedTodo.id, title: updatedTodo.title },
          });
        })
        .catch(() => {
          setIsEdinting(true);
          handleError(errors.UpdateTodo);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleToggle = () => {
    setIsLoading(true);

    updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(completedTodo => {
        dispatch({
          type: ActionNames.Completed,
          payload: { id: todo.id, completed: !completedTodo.completed },
        });
        setIsLoading(false);
      })
      .catch(() => {
        handleError(errors.UpdateTodo);
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setIsEdinting(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todoapp__edit-todo"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={inputValue}
            onChange={handleEditInput}
            onBlur={() => handleBlur()}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([todo.id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading || isLoading || isLoadingAll,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
