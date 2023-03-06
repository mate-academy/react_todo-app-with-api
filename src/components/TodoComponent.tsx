/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-autofocus */
import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { ChangeField, Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  onChange?: (id: number, todoField: ChangeField) => void,
  isTodoLoading?: boolean
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  onDelete,
  onChange,
  isTodoLoading,
}) => {
  const { title, completed, id } = todo;
  const [isLoading, setIsLoading] = useState<boolean>(isTodoLoading || false);
  const [input, setInput] = useState<string>(title);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleTodoDelete = async () => {
    if (onDelete) {
      setIsLoading(true);

      await onDelete(id);
    }
  };

  const handleCompletedChange = async () => {
    if (onChange) {
      setIsLoading(true);

      await onChange(id, { completed: !completed });
      setIsLoading(false);
    }
  };

  const handleTitleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    if (event.detail === 2) {
      setIsInputVisible(true);
    }
  };

  const escFunction = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsInputVisible(false);

      document.removeEventListener('keyup', escFunction);
    }
  };

  const handleTitleChange = async () => {
    setIsInputVisible(true);

    document.addEventListener('keyup', escFunction);

    if (input === title) {
      setIsInputVisible(false);

      return;
    }

    if (input === '') {
      if (onDelete) {
        setIsLoading(true);

        await onDelete(id);

        return;
      }
    }

    if (onChange) {
      setIsLoading(true);

      await onChange(id, { title: input });
      setIsLoading(false);
    }

    setIsInputVisible(false);
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {
        isInputVisible
          ? (
            <input
              className="todo__title-field"
              value={input}
              onChange={handleInputChange}
              onBlur={handleTitleChange}
              autoFocus
            />
          )
          : (
            <>
              <span
                className="todo__title"
                onClick={handleTitleDoubleClick}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={handleTodoDelete}
              >
                ×
              </button>
            </>
          )
      }

      {
        (isLoading || id === 0) && (
          <div className="modal overlay" style={{ display: 'flex' }}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};
