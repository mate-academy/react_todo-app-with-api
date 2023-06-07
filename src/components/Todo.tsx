/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { TodoData } from '../types/TodoData';

interface TodoFieldProps {
  todo: TodoData,
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (updatedTodo: TodoData) => Promise<void>;
}

export const Todo = ({
  onTodoDelete, onTodoUpdate, todo,
}: TodoFieldProps) => {
  const { completed, title, id } = todo;

  const [isTodoBeingEdited, setIsTodoBeingEdited] = useState(false);
  const [isTodoBeingDeleted, setIsTodoBeingDeleted] = useState(false);
  const [isTodoBeingUpdated, setIsTodoBeingUpdated] = useState(false);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);
  const todoInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = () => {
    const newTodo = { ...todo, completed: !completed };

    setIsTodoBeingUpdated(true);

    onTodoUpdate(newTodo).finally(() => setIsTodoBeingUpdated(false));
  };

  const handleTodoRemoval = () => {
    setIsTodoBeingDeleted(true);
    onTodoDelete(id).finally(() => setIsTodoBeingDeleted(false));
  };

  const handleEditedTodoSubmission
  = (event: React.FormEvent<HTMLFormElement>
  | React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (updatedTodoTitle) {
      setIsTodoBeingUpdated(true);
      const newTodo = { ...todo, title: updatedTodoTitle };

      onTodoUpdate(newTodo).finally(() => setIsTodoBeingUpdated(false));
    } else {
      handleTodoRemoval();
    }
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Escape':
        setUpdatedTodoTitle(title);
        setIsTodoBeingEdited(false);
        break;
      case 'Enter':
        handleEditedTodoSubmission(event);
        setIsTodoBeingEdited(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (todoInputRef.current) {
      if (isTodoBeingEdited) {
        todoInputRef.current.focus();
      } else {
        todoInputRef.current.blur();
      }
    }
  }, [isTodoBeingEdited]);

  const isTodoBeingLoaded = id === 0
    || isTodoBeingDeleted || isTodoBeingUpdated;

  return (
    <>
      <div className={classNames('todo', { completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCheckboxChange}
          />
        </label>
        {isTodoBeingEdited ? (
          <form onSubmit={handleEditedTodoSubmission}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTodoTitle}
              onChange={(event) => setUpdatedTodoTitle(event.target.value)}
              onKeyUp={handleInputKeyUp}
              ref={todoInputRef}
              onBlur={() => setIsTodoBeingEdited(false)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsTodoBeingEdited(true)}
            >
              {title}

            </span>
            <div className={classNames('modal overlay', {
              'is-active': isTodoBeingLoaded,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoRemoval}
            >
              ×
            </button>

          </>
        )}
      </div>
    </>
  );
};
