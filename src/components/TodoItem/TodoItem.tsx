import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { ErrorMessages } from '../../utils/ErrorMessages';

interface Props {
  todo: Todo,
  deleteItem: (todoId: number) => void,
  isLoading: boolean,
  setLoading: (arg: boolean) => void,
  idToDelete: number[],
  updateTodoStatus: (todo: Todo) => void,
  updateTodoTitle: (updatedTodo: Todo) => void,
  setErrorMessage: (errorMessage: string) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteItem,
  isLoading,
  setLoading,
  idToDelete,
  updateTodoStatus,
  updateTodoTitle,
  setErrorMessage,
}) => {
  const { id, completed, title } = todo;
  const [value, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value.trim() === '') {
      deleteItem(id);
    } else if (value.trim() !== title) {
      setLoading(true);

      updateTodo({
        ...todo,
        title: value.trim(),
      })
        .then((updatedTodo) => {
          setLoading(false);
          setIsEditing(false);
          updateTodoTitle(updatedTodo);
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UPDATE);
          setLoading(false);
          setIsEditing(false);
        });
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = (event: React.FormEvent<HTMLFormElement>) => {
    if (isEditing) {
      handleSubmit(event);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValue(title);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isEditing) {
      handleCancelEdit();
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodoStatus(todo)}
        />
      </label>

      {
        isEditing
          ? (
            <form
              onSubmit={(event) => handleSubmit(event)}
              onBlur={handleBlur}
            >
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyUp={handleKeyUp}
              />
            </form>
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={handleDoubleClick}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteItem(id)}
              >
                ×
              </button>
            </>
          )
      }

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading && (idToDelete.includes(id) || isEditing) },
      )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
