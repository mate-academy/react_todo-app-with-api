/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { ChangeEvent, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/todo';
import { TodoDeleteButton } from '../TodoDeleteButton';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingTodos: boolean;
  changeTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  changeTodo,
  isLoadingTodos,
}) => {
  const [inputText, setInputText] = useState('');
  const [inputIsEditing, setInputIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    let success = true;

    //updates todo if title changed
    if (inputText.trim() && inputText.trim() !== todo.title) {
      try {
        await changeTodo({ ...todo, title: inputText.trim() });
      } catch {
        success = false;
      }
    }

    //deletes todo if title is empty
    if (!inputText.trim()) {
      try {
        await onDelete(todo.id);
      } catch {
        success = false;
      }
    }

    if (success) {
      setInputIsEditing(false);
    } else {
      //focused if request failed
      inputRef.current?.focus();
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleSubmit();
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

          <TodoDeleteButton
            onDelete={() => onDelete(todo.id)}
            todoId={todo.id}
          />
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
