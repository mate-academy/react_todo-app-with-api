/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isInEditMode?: boolean;
  setEditedTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    onRemoveTodo,
    onUpdateTodo,
    isInEditMode,
    setEditedTodoId,
  } = props;

  const [titleValue, setTitleValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const handleBlur = async (
    event:
      | React.FocusEvent<HTMLFormElement, Element>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizeTitle = titleValue.trim();

    if (todo.title === normalizeTitle) {
      setEditedTodoId(null);

      return;
    }

    try {
      if (normalizeTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: normalizeTitle });
      }

      setEditedTodoId(null);
    } catch (error) {
      inputRef?.current?.focus();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTitleValue(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onCheckTodo}
        />
      </label>

      {isInEditMode ? (
        <form onSubmit={handleBlur} onBlur={handleBlur}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleValue}
            onChange={event => setTitleValue(event.target.value)}
            onKeyUp={onKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
