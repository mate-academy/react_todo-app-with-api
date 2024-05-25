import React, { useContext, useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodo, USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todo?.title);
  const [loading, setLoading] = useState(false);

  const dispatch = useContext(DispatchContext);
  const { loadingAll, error } = useContext(StateContext);

  const onDelete = () => {
    setLoading(true);
    if (USER_ID) {
      deleteTodo(todo.id)
        .then(() => {
          dispatch({
            type: ActionTypes.DELETE_TODO,
            payload: todo.id,
          });
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: 'Unable to delete a todo',
          });
        })
        .finally(() => {
          setLoading(false);
          dispatch({ type: ActionTypes.SET_REFRESH });
        });
    }
  };

  const onToggle = () => {
    setLoading(true);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        dispatch({ type: ActionTypes.TOGGLE_TODO, payload: updatedTodo });
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: 'Unable to update a todo',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onBlur = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setEditMode(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete();

      return;
    }

    setLoading(true);
    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        dispatch({ type: ActionTypes.EDIT_TODO, payload: updatedTodo });
        setTitle(trimmedTitle);
        setEditMode(false);
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: 'Unable to update a todo',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onBlur();
  };

  const onEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditMode(false);
      setTitle(todo.title);
    }
  };

  const renameField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameField.current && editMode) {
      renameField.current.focus();
    }
  }, [editMode]);

  return (
    <div data-cy="Todo" className={todo?.completed ? 'todo completed' : 'todo'}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          onChange={onToggle}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>
      {editMode ? (
        <form onSubmit={onSubmit} onBlur={onBlur}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            ref={renameField}
            onKeyUp={onEscape}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setEditMode(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>
          <button
            onClick={onDelete}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(todo.id === 0 || loading || loadingAll) && !error ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
