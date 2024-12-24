/* eslint-disable jsx-a11y/label-has-associated-control */
/*eslint-disable*/
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  isInEditMode?: boolean;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  setEditedTodoId: Dispatch<SetStateAction<null | number>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    isInEditMode,
    onRemoveTodo,
    onUpdateTodo,
    setEditedTodoId,
  } = props;

  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  // eslint-disable-next-line max-len, prettier/prettier
  const onBlur = async (
    // eslint-disable-next-line max-len
    event:
    | React.FocusEvent<HTMLInputElement, Element> | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const normalizedTitle = todoTitleValue.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodoId(null);

      return;
    }

    try {
      if (normalizedTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: normalizedTitle });
      }

      setEditedTodoId(null);
    } catch (err) {
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
      className={classNames('todo', { completed: todo.completed })}
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
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
