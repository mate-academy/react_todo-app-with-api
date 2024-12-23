/* eslint-disable */

import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isInEditMode?: boolean;
  setEditedTodoId: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    onDeleteTodo,
    onUpdateTodo,
    isInEditMode,
    isLoading,
    setEditedTodoId,
  } = props;

  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const onBlur = async (event: React.FocusEvent<HTMLFormElement, Element> | React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = todoTitleValue.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodoId(null);

      return;
    }

    try {
      if (!normalizedTitle.length) {
        await onDeleteTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: normalizedTitle });
      }

      setEditedTodoId(null);
    } catch (error) {
      inputRef?.current?.focus();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTodoTitleValue(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: props.todo.completed })}
    >
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
        <form onSubmit={onBlur} onBlur={onBlur}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleValue}
            onChange={e => setTodoTitleValue(e.target.value)}
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
            onClick={() => onDeleteTodo(todo.id)}
            data-cy="TodoDelete"
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
