import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import { deleteTodos, patchTodos } from '../../api/todos';

type Props = {
  todoItem: TodoType
  todosUpdate: () => void,
  setDeleteError: (errorState: boolean) => void;
  setPostError: (errorState: boolean) => void;
  isClearAllCompleted: boolean,
  toggleActive: boolean,
  toggleCompleted: boolean,
};

export const Todo: React.FC<Props>
= React.memo(
  ({
    todoItem,
    todosUpdate,
    setDeleteError,
    setPostError,
    isClearAllCompleted,
    toggleActive,
    toggleCompleted,
  }) => {
    const { completed, title, id } = todoItem;

    const [isLoading, setLoading] = useState(false);
    const [isEditing, setEdit] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const setFocusOnForm = () => {
      const inputElement
      = document
        .querySelector('.todo__title-field') as HTMLInputElement | null;

      if (inputElement) {
        inputElement.focus();
      }
    };

    useEffect(() => {
      setFocusOnForm();
    }, [isEditing]);

    const handleDeleteTodos = () => {
      setLoading(true);

      deleteTodos(id)
        .then(() => setLoading(false))
        .catch(() => {
          setDeleteError(true);
        })
        .finally(() => {
          setLoading(false);
          todosUpdate();
        });
    };

    const handeleCompletedStatus
    = (
      todoId: typeof id,
      currCompletedStatus: typeof completed,
    ) => {
      setLoading(true);
      patchTodos(todoId, { completed: !currCompletedStatus })
        .catch(() => setPostError(true))
        .finally(() => {
          setLoading(false);
          todosUpdate();
        });
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      if (!inputValue.trim().length) {
        handleDeleteTodos();
      } else if (inputValue === title) {
        setEdit(false);
        event.currentTarget.blur();
      } else {
        setEdit(false);
        setLoading(true);
        patchTodos(id, { title: inputValue })
          .catch(() => setPostError(true))
          .finally(() => {
            setLoading(false);
            todosUpdate();
          });
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.currentTarget.blur();
      } else if (event.key === 'Escape') {
        setInputValue(title);
        setEdit(false);
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;

      setInputValue(value);
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
            defaultChecked={completed}
            onChange={() => handeleCompletedStatus(id, completed)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={inputValue.length ? inputValue : title}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setEdit(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodos}
            >
              ×
            </button>
          </>

        )}

        <div className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading
          || (completed && isClearAllCompleted)
          || (completed && toggleCompleted)
          || (!completed && toggleActive),
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
