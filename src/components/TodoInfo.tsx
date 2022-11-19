import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { chandeTodoText } from '../api/todos';

type Props = {
  todo: Todo;
  setErrorMessage: (value: string) => void;
  // isAdding: boolean;
  togleStatus: (
    id: number,
    completed: boolean,
    activateLoader:(val: boolean) => void) => void;
  deleteTodo: (id: number) => void;
  activeTodosId: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  setErrorMessage,
  togleStatus,
  deleteTodo,
  activeTodosId,
}) => {
  const { title, completed, id } = todo;
  const [updatingStarted, setUpdatingStarted] = useState(false);
  const [dbClicked, setDbClicked] = useState(false);
  const [inputText, setInputText] = useState(title);

  const newTitle = useRef<HTMLInputElement>(null);

  const handleInputChange = async () => {
    if (title === inputText) {
      setDbClicked(false);

      return;
    }

    setUpdatingStarted(true);

    try {
      if (inputText) {
        await chandeTodoText(id, inputText);
      } else {
        deleteTodo(id);
      }
    } catch {
      setErrorMessage('Unable to update a todo');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setUpdatingStarted(false);
    setDbClicked(false);
  };

  useEffect(() => {
    if (newTitle.current) {
      newTitle.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          'todo completed': completed === true,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => togleStatus(id, completed, setUpdatingStarted)}
        />
      </label>

      {dbClicked
        ? (
          <form onSubmit={handleInputChange}>
            <input
              data-cy="TodoTitleField"
              className="todo__title-field"
              ref={newTitle}
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onBlur={handleInputChange}
              placeholder="Empty todo will be deleted"
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setDbClicked(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      { (activeTodosId.includes(id) || updatingStarted) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
