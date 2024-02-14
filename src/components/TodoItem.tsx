import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { DispatchContext, StateContext } from '../management/TodoContext';
import { Loader } from './Loader';
import { deleteTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);
  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdited && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEdited]);

  function handleStatus() {
    dispatch({ type: 'isLoading', payload: true });
    dispatch({ type: 'createCurrentId', payload: id });
    updateTodo({ id, title, completed: !completed })
      .then(newTodo => {
        dispatch({
          type: 'markStatus',
          payload: newTodo.id,
          completed: newTodo.completed,
        });
      }).catch(() => {
        dispatch({ type: 'getTodos', payload: todos });
        dispatch({ type: 'errorMessage', payload: 'Unable to update a todo' });
      })
      .finally(() => {
        dispatch({ type: 'isLoading', payload: false });
        dispatch({ type: 'clearCurrentId' });
      });
  }

  function handleDeleteTodo() {
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
  }

  function handleSaveEditTitle() {
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
          }).catch(() => {
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

  function editFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSaveEditTitle();
  }

  function handleCancelEdit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEdited(false);
    }
  }

  function checkEdited() {
    setIsEdited(true);
  }

  function getEditTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setEditedTitle(e.target.value)
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
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
            onDoubleClick={checkEdited}
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
            onChange={getEditTitle}
            onBlur={handleSaveEditTitle}
            onKeyUp={handleCancelEdit}
          />
        </form>
      )}

      <Loader id={id} />
    </div>
  );
};
