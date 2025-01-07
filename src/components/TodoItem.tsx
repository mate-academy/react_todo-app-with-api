/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  isInEditingProcess?: boolean;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todoToUpdate: Todo) => Promise<void>;
  setEditedTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};
export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    isInEditingProcess,
    onDeleteTodo,
    onUpdateTodo,
    setEditedTodoId,
  } = props;

  const [todoTitleValue, setTodoTitleValue] = useState<string>(todo.title);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const onBlur = async () => {
    const normalizedTitle = todoTitleValue.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodoId(null);

      return;
    }

    if (normalizedTitle === '') {
      try {
        await onDeleteTodo(todo.id);
        setEditedTodoId(null);
      } catch (err) {}

      return;
    }

    try {
      await onUpdateTodo({ ...todo, title: normalizedTitle });

      setEditedTodoId(null);
    } catch (err) {}
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onBlur();
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
      className={cn('todo', {
        completed: todo.completed,
      })}
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

      {isInEditingProcess ? (
        <form onSubmit={onSubmit}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleValue}
            onChange={event => setTodoTitleValue(event.target.value)}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
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
            onClick={() => {
              onDeleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
