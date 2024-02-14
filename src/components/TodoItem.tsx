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

  function hendleStatus() {
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

  function hendleDeleteTodo() {
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

  function hendleSaveEditTitle() {
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
      hendleDeleteTodo();
    }
  }

  function editFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    hendleSaveEditTitle();
  }

  function hendleCancelEdit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEdited(false);
    }
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
          onChange={hendleStatus}
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
            onClick={hendleDeleteTodo}
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
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={hendleSaveEditTitle}
            onKeyUp={hendleCancelEdit}
          />
        </form>
      )}

      <Loader id={id} />
    </div>
  );
};
