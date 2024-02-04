/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */

import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodoContext } from '../TodoContext';
import { Todo, TodoContextProps } from '../types/interfaces';

interface ItemProps {
  todo: Todo
}

export const TodoItem: React.FC<ItemProps> = ({ todo }) => {
  const {
    handleCheck,
    handleDeleteTodo,
    setIsLoading,
    isLoading,
    handleEditTodo,
    isEditing,
    setIsEditing,

  } = useContext(TodoContext) as TodoContextProps;

  const [onInput, setOnInput] = useState('');

  const todoTitleFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleFieldRef.current?.focus();
  }, [isEditing]);

  const onClickHandler: React.MouseEventHandler<HTMLInputElement> = () => {
    setIsLoading(prev => (
      [...prev, todo.id]
    ));
    handleCheck(todo);
  };

  const onDeleteTodo: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsLoading(prev => (
      [...prev, todo.id]
    ));
    handleDeleteTodo(todo);
  };

  function onEdit() {
    setIsEditing(todo.id);
    setOnInput(todo.title);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && onInput.trim() && onInput !== todo.title) {
      setIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleEditTodo(todo, onInput.trim());
    } else if (event.key === 'Enter' && onInput.trim() === '') {
      setIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleDeleteTodo(todo);
    } else if ((event.key === 'Enter' && onInput === todo.title)
    || (event.key === 'Escape')) {
      setIsEditing(null);
    }
  }

  const onBlur = () => {
    if (todo.title !== onInput && onInput.trim() !== '') {
      setIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleEditTodo(todo, onInput.trim());
    } else if (onInput.trim() === '') {
      setIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleDeleteTodo(todo);
    } else if (onInput === todo.title) {
      setIsEditing(null);
    }
  };

  const editMode = todo.id === isEditing;
  const loading = isLoading.includes(todo.id);

  return (
    <>
      {editMode ? (
        <div
          onDoubleClick={onEdit}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={onClickHandler}
            />
          </label>

          <span>
            <input
              ref={todoTitleFieldRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={onInput}
              onChange={(event) => setOnInput(event.target.value)}
              onBlur={onBlur}
              onKeyDown={handleKeyPress}
            />
          </span>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', { 'is-active': loading || todo.id === 0 })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={onEdit}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={onClickHandler}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDeleteTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', { 'is-active': loading || todo.id === 0 })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

    </>
  );
};
