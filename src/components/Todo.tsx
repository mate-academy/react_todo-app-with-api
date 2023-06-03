/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useState } from 'react';
import { TodoData } from '../types/TodoData';

interface TodoFieldProps {
  todo: TodoData,
  isTempTodo: boolean,
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (updatedTodo: TodoData) => Promise<void>;
}

export const Todo = ({
  onTodoDelete, onTodoUpdate, isTempTodo, todo,
}: TodoFieldProps) => {
  const { completed, title, id } = todo;

  const [isTodoEdited, setIsTodoEdited] = useState(false);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [isTodoUpdating, setIsTodoUpdating] = useState(false);
  const [mouseClickCount, setMouseClickCount] = useState(0);
  const [editedTodoTitle, setEditedTodoTitle] = useState(title);

  const handleCheckboxChange = () => {
    const newTodo = { ...todo, completed: !completed };

    setIsTodoUpdating(true);

    onTodoUpdate(newTodo).finally(() => setIsTodoUpdating(false));
  };

  const handleTodoRemoval = () => {
    setIsTodoDeleting(true);
    onTodoDelete(id).finally(() => setIsTodoDeleting(false));
  };

  const handleEditedTodoSubmission
  = (event: React.FormEvent<HTMLFormElement>
  | React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (editedTodoTitle) {
      setIsTodoUpdating(true);
      const newTodo = { ...todo, title: editedTodoTitle };

      onTodoUpdate(newTodo).finally(() => setIsTodoUpdating(false));
    } else {
      handleTodoRemoval();
    }
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Escape':
        setEditedTodoTitle(title);
        setIsTodoEdited(false);
        setMouseClickCount(0);
        break;
      case 'Enter':
        handleEditedTodoSubmission(event);
        setIsTodoEdited(false);
        setMouseClickCount(0);
        break;
      default:
        break;
    }
  };

  const handleInputEdition = () => {
    if (mouseClickCount === 2) {
      setIsTodoEdited(true);
      setMouseClickCount(0);
    } else {
      setMouseClickCount(prevMouseClickCount => (
        prevMouseClickCount + 1));
    }
  };

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
        {isTodoEdited ? (
          <form onSubmit={handleEditedTodoSubmission}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodoTitle}
              onChange={(event) => setEditedTodoTitle(event.target.value)}
              onKeyUp={handleInputKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onClick={handleInputEdition}
            >
              {title}

            </span>
            <div className={classNames('modal overlay', {
              todo: isTempTodo || isTodoDeleting || isTodoUpdating,
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
