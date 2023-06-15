import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeletingTodo: (id: number) => void,
  tempTodo?: Todo | null
  todosForTemp: number[]
  handleUpdatingTodo: (id: number, data: null | string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeletingTodo,
  tempTodo,
  todosForTemp,
  handleUpdatingTodo,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [titleValue, setTitleValue] = useState(title);
  const [isChanged, setIsChanged] = useState(false);

  const handleDoubleClick = () => {
    setIsChanged(true);
  };

  const handlerCancelEditing = () => {
    setIsChanged(false);
    setTitleValue(title);
  };

  const handleSaveChanges = () => {
    setIsChanged(false);
    if (!titleValue.length) {
      handleDeletingTodo(id);
    } else if (title === titleValue) {
      handlerCancelEditing();
    } else {
      handleUpdatingTodo(id, titleValue);
    }
  };

  const keyDownHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Escape') {
      handlerCancelEditing();
    } else if (ev.key === 'Enter') {
      handleSaveChanges();
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleUpdatingTodo(id, null)}
        />
      </label>
      {
        isChanged ? (
          <input
            className="todo__title-field"
            type="text"
            value={titleValue}
            onChange={(ev) => setTitleValue(ev.target.value)}
            onDoubleClick={handleDoubleClick}
            onBlur={handleSaveChanges}
            onKeyDown={(ev) => keyDownHandler(ev)}
            ref={input => input && input.focus()}
          />
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => handleDoubleClick()}
            >
              {titleValue}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeletingTodo(id)}
            >
              ×
            </button>
          </>
        )
      }
      <div className={classNames('modal overlay',
        {
          'is-active': tempTodo?.id === id || todosForTemp.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
