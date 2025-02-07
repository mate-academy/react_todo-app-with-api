/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  isInEditMode?: boolean;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
  setEditedTodo: Dispatch<SetStateAction<null | number>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    handleDeleteTodo,
    handleUpdateTodo,
    isInEditMode,
    setEditedTodo,
  } = props;

  const [updateTodoTitle, setUpdateTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChekTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    handleUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodo(todo.id);
  };

  // eslint-disable-next-line max-len, prettier/prettier
  const handleClickBlur = async (event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLFormElement, Element>) => {
    event.preventDefault();

    const normalizedTitle = updateTodoTitle.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodo(null);

      return;
    }

    if (!normalizedTitle) {
      try {
        await handleDeleteTodo(todo.id);
        setEditedTodo(null);
      } catch (err) {
        inputRef?.current?.focus();
      }

      return;
    }

    try {
      await handleUpdateTodo({ ...todo, title: normalizedTitle });
      setEditedTodo(null);
    } catch (err) {}
  };

  const controlValue = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUpdateTodoTitle(event.target.value);
  };

  const clickEscToExit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);
      setUpdateTodoTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onChekTodo}
        />
      </label>

      {isInEditMode ? (
        <form onSubmit={handleClickBlur} onBlur={handleClickBlur}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updateTodoTitle}
            onChange={controlValue}
            onKeyUp={clickEscToExit}
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
            onClick={() => handleDeleteTodo(todo.id)}
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
