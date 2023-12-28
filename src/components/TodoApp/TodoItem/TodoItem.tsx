/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  ChangeEvent, KeyboardEvent,
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../../libs/types';
import { Actions, ErrorMessages, KeysEvent } from '../../../libs/enums';
import { DispatchContext, StateContext } from '../../../libs/state';
import { deleteTodo, updateTodo } from '../../../api/todos';
import { setErrorMessage } from '../../../libs/helpers';

type Props = {
  item: Todo;
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const { id, title, completed } = item;

  const dispatch = useContext(DispatchContext);
  const { loader } = useContext(StateContext);

  const isShowLoader = loader.isLoading && loader.todoIds.includes(id);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);

  const editingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editingInputRef.current) {
      editingInputRef.current.focus();
    }
  }, [isEditing]);

  const removeTodo = useCallback((todoId: number) => {
    dispatch({
      type: Actions.setLoader,
      payload: { isLoading: true, todoIds: [todoId] },
    });

    deleteTodo(todoId)
      .then(() => {
        dispatch({ type: Actions.delete, payload: { todoId } });
      })
      .catch(() => {
        setErrorMessage(dispatch, ErrorMessages.FailedToDelete);
      })
      .finally(() => {
        dispatch({ type: Actions.setLoader, payload: { isLoading: false } });
      });
  }, [dispatch]);

  const editTodo = useCallback((todoId: number, updatedData: Partial<Todo>) => {
    dispatch({
      type: Actions.setLoader,
      payload: { isLoading: true, todoIds: [todoId] },
    });

    updateTodo(todoId, updatedData)
      .then((response) => {
        dispatch({ type: Actions.update, payload: { todo: response } });
      })
      .catch(() => {
        setErrorMessage(dispatch, ErrorMessages.FailedToUpdate);
      })
      .finally(() => {
        dispatch({ type: Actions.setLoader, payload: { isLoading: false } });
      });
  }, [dispatch]);

  const handleRemove = () => {
    removeTodo(id);
  };

  const handleCompletedToggle = () => {
    editTodo(id, { completed: !completed });
  };

  const handleShowEditInput = () => {
    setIsEditing(true);
  };

  const handleChangeEditingTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTitle(title);
  };

  const saveEditing = () => {
    setIsEditing(false);
    const trimmedEditingTitle = editingTitle.trim();

    if (!trimmedEditingTitle) {
      removeTodo(id);

      return;
    }

    if (trimmedEditingTitle !== title) {
      editTodo(id, { title: editingTitle });
    }
  };

  const handleEditInputLoseFocus = () => {
    saveEditing();
  };

  const handleSaveEditedTitle = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KeysEvent.escape) {
      resetEditing();
    }

    if (event.key === KeysEvent.enter) {
      saveEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedToggle}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editingInputRef}
            value={editingTitle}
            onChange={handleChangeEditingTitle}
            onBlur={handleEditInputLoseFocus}
            onKeyUp={handleSaveEditedTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleShowEditInput}
          >
            { title }
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isShowLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
