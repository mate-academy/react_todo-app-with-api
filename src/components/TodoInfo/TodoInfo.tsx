import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo: (id:number) => void;
  updateTodo: (todo:Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  deleteTodo,
  updateTodo,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTodo({ ...todo, completed: e.target.checked });
  };

  const changeTitle = () => {
    setIsEditing(false);
    if (inputValue === title) {
      return;
    }

    if (inputValue) {
      updateTodo({ ...todo, title: inputValue });
    } else {
      deleteTodo(id);
    }
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    changeTitle();
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChange}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputEl}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onChange={
                e => setInputValue(e.target.value)
              }
              onBlur={changeTitle}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={
                () => setIsEditing(true)
              }
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
