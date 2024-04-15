/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { deleteTodos, updateTodo } from '../../api/todos';

type Props = {
  todo: TodoType;
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [changedValue, setChangedValue] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const { tempTodo, isRemoving, isTogglingAll } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const editingField = useRef<HTMLInputElement>(null);

  const isCompleted = () => {
    setIsLoading(true);

    updateTodo({ id: todo.id, data: { completed: !todo.completed } })
      .then(response => {
        const responseTodo = response as TodoType;

        dispatch({ type: Actions.markCompleted, id: responseTodo.id });
      })
      .catch(() => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to update a todo',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = () => {
    setIsLoading(true);

    deleteTodos(todo.id)
      .then(() => {
        dispatch({ type: Actions.deleteTodo, id: todo.id });
        setIsLoading(false);
      })
      .catch(error => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to delete a todo',
        });
        setIsLoading(false);

        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangedValue(e.target.value);
  };

  const cancelEditing = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Escape' ||
      (e.key === 'Enter' && todo.title === changedValue)
    ) {
      setChangedValue(todo.title);
      setIsEditing(prev => !prev);

      return;
    }
  };

  const handleUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (changedValue.length > 1) {
      updateTodo({ id: todo.id, data: { title: changedValue } })
        .then(response => {
          const responseTodo = response as TodoType;

          dispatch({
            type: Actions.updateTodo,
            id: responseTodo.id,
            title: responseTodo.title.trim(),
          });

          setIsEditing(prev => !prev);
        })
        .catch(() => {
          dispatch({
            type: Actions.setErrorLoad,
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      handleDelete();
    }
  };

  useEffect(() => {
    if (isEditing && editingField.current) {
      editingField.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          onChange={isCompleted}
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodo}>
          <input
            ref={editingField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleChange}
            onKeyDown={cancelEditing}
            value={changedValue}
            onBlur={handleUpdateTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(prev => !prev)}
          >
            {todo.title}
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
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading ||
            isTogglingAll ||
            tempTodo?.id === todo.id ||
            (isRemoving && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
