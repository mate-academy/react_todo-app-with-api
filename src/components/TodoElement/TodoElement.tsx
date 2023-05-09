import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import '../../styles/animation.scss';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleRemove: (id: number) => void;
  handleToggle: (id: number, completed: boolean) => void;
  handleInputRename: (id: number, title: string) => void;
  isEditingFinished: boolean;
  handleInputBlur: () => void;
  handleCancelEditing: (e: React.KeyboardEvent) => void;
  inputTitle: string;
  setInputTitle: (inputTitle: string) => void;
  processedIds: number[];
  currTodoId: number | null;
}

export const TodoElement: React.FC<Props> = ({
  todo,
  handleRemove,
  handleToggle,
  handleInputRename,
  handleInputBlur,
  handleCancelEditing,
  inputTitle,
  isEditingFinished,
  setInputTitle,
  processedIds,
  currTodoId,
}) => {
  const { completed, title, id } = todo;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currTodoId]);

  return (
    <li
      className={
        classNames('todo', { completed })
      }
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggle(id, completed)}
        />
      </label>

      {currTodoId !== id ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleInputRename(id, title)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleRemove(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleInputBlur}>
          <input
            type="text"
            className="todo__title-field"
            ref={inputRef}
            value={inputTitle}
            onKeyUp={handleCancelEditing}
            placeholder={
              !inputTitle.length
                ? 'Empty todo will be deleted'
                : undefined
            }
            onBlur={handleInputBlur}
            onChange={(e) => setInputTitle(e.target.value)}
          />
        </form>
      )}

      <div className={classNames('modal overlay', {
        'is-active': !id
          || processedIds.includes(id)
          || (isEditingFinished && id === currTodoId),
      })}
      >

        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
