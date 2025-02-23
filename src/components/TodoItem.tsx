import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../managment/TodoContext';
import { Todo } from '../types/Types';
import { Loader } from './Loader';
import { deleteTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);
  const { id, title, completed } = todo;

  const [editedTitle, setEditedTitle] = useState(title);
  const [isEdited, setIsEdited] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdited && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEdited]);

  const handleStatus = () => {
    dispatch({ type: 'isLoading', payload: true });
    dispatch({ type: 'createCurrentId', payload: id });
    updateTodo({ id, title, completed: !completed })
      .then(newTodo => {
        dispatch({
          type: 'markStatus',
          payload: newTodo.id,
          completed: newTodo.completed,
        });
      })
      .catch(() => {
        dispatch({ type: 'getTodos', payload: todos });
        dispatch({ type: 'errorMessage', payload: 'Unable to update a todo' });
      })
      .finally(() => {
        dispatch({ type: 'isLoading', payload: false });
        dispatch({ type: 'clearCurrentId' });
      });
  };

  const handleDeleteTodo = () => {
    dispatch({ type: 'isLoading', payload: true });
    dispatch({ type: 'createCurrentId', payload: id });

    deleteTodo(id)
      .then(() => {
        dispatch({ type: 'deleteTodo', payload: id });
      })
      .catch(() => {
        dispatch({ type: 'getTodos', payload: todos });
        dispatch({ type: 'errorMessage', payload: 'Unable to delete a todo' });
      })
      .finally(() => {
        dispatch({ type: 'isLoading', payload: false });
        dispatch({ type: 'clearCurrentId' });
      });
  };

  function handleSaveEditForm() {
    if (editedTitle.trim()) {
      if (editedTitle.trim() === title) {
        setIsEdited(false);
      } else {
        dispatch({ type: 'isLoading', payload: true });
        dispatch({ type: 'createCurrentId', payload: id });
        updateTodo({ id, title: editedTitle, completed })
          .then(newTodo => {
            dispatch({
              type: 'editTitle',
              id: newTodo.id,
              newTitle: newTodo.title,
            });
            setIsEdited(false);
          })
          .catch(() => {
            if (titleRef.current) {
              titleRef.current.focus();
            }

            dispatch({
              type: 'errorMessage',
              payload: 'Unable to update a todo',
            });
          })
          .finally(() => {
            dispatch({ type: 'isLoading', payload: false });
            dispatch({ type: 'clearCurrentId' });
          });
      }
    } else {
      handleDeleteTodo();
    }
  }

  const editFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveEditForm();
  };

  const handleCancelEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatus}
        />
      </label>

      {!isEdited ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={editFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={titleRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSaveEditForm}
            onKeyUp={handleCancelEdit}
          />
        </form>
      )}

      <Loader id={id} />
    </div>
  );
};
