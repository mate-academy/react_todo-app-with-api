import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void,
  isLoading: boolean,
  statusChange: (todoId: number, updatedFields: Partial<Todo>) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  statusChange,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleCancel = () => {
    setNewTitle(todo.title);
    setIsChanging(false);
  };

  const handleSubmitForm = (event:
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement, Element>) => {
    event.preventDefault();
    if (!newTitle) {
      onDelete(todo.id);
    } else {
      statusChange(todo.id, { title: newTitle });
      setIsChanging(false);
    }
  };

  const handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isChanging]);

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => statusChange(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isChanging ? (
        <form onSubmit={handleSubmitForm}>
          <input
            className="todo__title-field"
            type="text"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={handleSubmitForm}
            ref={inputField}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsChanging(true)}
        >
          {todo.title}
        </span>
      )}
      {!isChanging && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
        >
          x
        </button>
      )}

      <div className={classNames('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
