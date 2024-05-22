/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Action, ActionNames, errors } from './TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  loading: boolean;
  dispatch: (action: Action) => void;
  handleError: (message: string) => void;
  handleLoading: (ids: number[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  dispatch,
  handleError,
  handleLoading,
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [isEditing, setIsEdinting] = useState(false);

  const handleEditInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDelete = () => {
    handleLoading([todo.id]);
    deleteTodo(todo.id)
      .then(() => {
        dispatch({ type: ActionNames.Delete, payload: todo.id });
      })
      .catch(() => handleError(errors.DeleteTodo))
      .finally(() => {
        handleLoading([]);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === inputValue.trim()) {
      setIsEdinting(false);

      return;
    }

    handleLoading([todo.id]);
    if (!inputValue.trim()) {
      handleDelete();
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
        .finally(() => handleLoading([]));
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
      handleDelete();
    } else if (inputValue) {
      handleLoading([todo.id]);

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
          handleLoading([]);
        });
    }
  };

  const handleToggle = () => {
    handleLoading([todo.id]);

    updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(completedTodo => {
        dispatch({
          type: ActionNames.Completed,
          payload: { id: todo.id, completed: !completedTodo.completed },
        });
        handleLoading([]);
      })
      .catch(() => {
        handleError(errors.UpdateTodo);
        handleLoading([]);
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
            onClick={() => handleDelete()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
