import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos, updateTodoOnServer } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { ChangeFunction } from '../../types/ChangeFunction';

type Props = {
  todo: Todo;
  isLoading: boolean;
  DeleteTodo?: (todoId: number) => void;
  ChangeTodo?: ChangeFunction;
  showError?: (errorType: ErrorMessage) => void;
  hideError?: () => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  DeleteTodo = () => {},
  ChangeTodo = () => {},
  showError = () => {},
  hideError = () => {},
}) => {
  const { title, completed, id } = todo;

  const [isEdited, setIsEdit] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const editFormRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editFormRef.current && isEdited) {
      editFormRef.current.focus();
    }
  }, [isEdited]);

  const handleDeleteTodo = async (onError?: () => void) => {
    hideError();
    setIsWaiting(true);

    try {
      await deleteTodos(id);
      DeleteTodo(id);
    } catch {
      showError(ErrorMessage.Delete);
      setIsWaiting(false);

      onError?.();
    }
  };

  const handleChangeTodo: ChangeFunction = async (
    todoId,
    propName,
    newPropValue,
    onError,
  ) => {
    hideError();
    setIsWaiting(true);

    try {
      await updateTodoOnServer(todoId, { [propName]: newPropValue });

      ChangeTodo(todoId, propName, newPropValue);
    } catch {
      showError(ErrorMessage.Update);

      onError?.();
    } finally {
      setIsWaiting(false);
    }
  };

  const handleStatusChange = () => {
    handleChangeTodo(id, 'completed', !completed);
  };

  const handleTitleChange = () => {
    const newTitle = editedTitle.trim();

    setIsEdit(false);
    setEditedTitle(newTitle);

    if (newTitle === title) {
      return;
    }

    const onError = () => {
      setEditedTitle(title);
    };

    if (!newTitle) {
      handleDeleteTodo(onError);

      return;
    }

    handleChangeTodo(id, 'title', newTitle, onError);
  };

  const cancelTitleChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Escape') {
      return;
    }

    setIsEdit(false);
    setEditedTitle(title);
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEdited
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleTitleChange();
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyUp={cancelTitleChange}
              ref={editFormRef}
            />
          </form>
        )
        : (
          <>
            <span
              role="button"
              tabIndex={0}
              aria-label="Press Enter to edit the title"
              className="todo__title"
              onKeyUp={(event) => {
                if (event.key !== 'Enter') {
                  return;
                }

                setIsEdit(true);
              }}
              onDoubleClick={() => setIsEdit(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo()}
              aria-label="Press Enter to delete the todo"
            >
              {'\u00d7'}
            </button>
          </>
        )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isWaiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
