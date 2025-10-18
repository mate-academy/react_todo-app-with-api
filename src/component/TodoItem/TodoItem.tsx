/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Data, Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  selected: number;
  todo: Todo;
  todoLoading: boolean;
  clearTodoComplete: boolean;
  changesTodo: number | undefined;
  deleteTodos: (todoId: number) => Promise<unknown>;
  cheketCompleted: (todoId: number) => Promise<void> | undefined;
  setChangesTodo: (todoId: number) => void;
  setSelected: (todoId: number) => void;
  handleInputChange: (event: React.FormEvent, data: Data) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, id, completed },
  todoLoading,
  changesTodo,
  clearTodoComplete,
  selected,
  handleInputChange,
  setChangesTodo,
  deleteTodos,
  cheketCompleted,
  setSelected,
}) => {
  const [inputValue, setInputValue] = useState(title);
  const [keyEnter, setKeyEnter] = useState(false);

  const titleFild = useRef<HTMLInputElement>(null);

  const handleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSelected(0);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      setKeyEnter(true);
    }
  };

  const handlInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
  };

  const handleSelected = (idSelected: number) => {
    setSelected(idSelected);
  };

  useEffect(() => {
    if (titleFild.current) {
      titleFild.current.focus();
    }
  }, [handleSelected]);

  const handleBlur = () => {
    if (keyEnter) {
      setKeyEnter(false);

      return;
    }

    titleFild.current?.form?.requestSubmit();

    setSelected(-1);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            cheketCompleted(id);
            setChangesTodo(id);
          }}
        />
      </label>
      {selected === id ? (
        <form
          onSubmit={event => {
            handleInputChange(event, {
              id: id,
              title: inputValue,
            });
            setChangesTodo(id);
          }}
        >
          <input
            ref={titleFild}
            data-cy="TodoTitleField"
            placeholder="Empty todo will be deleted"
            type="text"
            className="todo__title-field"
            value={inputValue}
            onChange={handlInputValue}
            onKeyUp={handleKeyup}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            handleSelected(id);
          }}
        >
          {title}
        </span>
      )}

      {id !== selected && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodos(id);
            setChangesTodo(id);
          }}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            (id === changesTodo && todoLoading) ||
            (completed === true && clearTodoComplete),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
