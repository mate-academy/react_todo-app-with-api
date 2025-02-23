/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingTodos: boolean;
  changeTodo: (todo: Todo) => Promise<void>;
  errorMessage: string;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  changeTodo,
  isLoadingTodos,
  errorMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [inputIsEditing, setInputIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      inputRef.current?.focus();
    }
  }, [errorMessage]);
  // handles escape key to cancel editing
  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setInputText('');
      setInputIsEditing(false);
    }
  };

  // handles double click on span
  const handleDoubleClick = () => {
    setInputIsEditing(true);
    setInputText(todo.title);
  };

  const handleFormInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  // handles form submission for updating or deleting todo
  const handleSubmit = async () => {
    if (inputText.trim() && inputText.trim() !== todo.title) {
      changeTodo({ ...todo, title: inputText.trim() }).then(() => {
        setInputIsEditing(false);
      });

      return;
    }
    //deletes todo if title is empty

    if (!inputText.trim()) {
      onDelete(todo.id);

      return;
    }

    setInputIsEditing(false);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit().then();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => changeTodo({ ...todo, completed: !todo.completed })}
          disabled={isLoadingTodos}
        />
      </label>
      {inputIsEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={inputText}
            autoFocus
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={handleFormInputChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoadingTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
