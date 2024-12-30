/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  isEditing?: boolean;
  onDeleteTodos: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  setEditedTodoId: Dispatch<SetStateAction<null | number>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    isEditing,
    onDeleteTodos,
    onUpdateTodo,
    setEditedTodoId,
  } = props;

  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const onBlur = async () => {
    if (todo.title === todoTitleValue.trim()) {
      return;
    }

    if (todoTitleValue.trim() === '') {
      try {
        await onDeleteTodos(todo.id);
        setEditedTodoId(null);
      } catch (error) {}

      return;
    }

    try {
      await onUpdateTodo({ ...todo, title: todoTitleValue });
      setEditedTodoId(null);
    } catch (err) {}
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onBlur();
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTodoTitleValue(todo.title);
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
          onChange={onCheckTodo}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => setTodoTitleValue(event.target.value)}
            value={todoTitleValue}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            disabled={isLoading}
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
            onClick={() => onDeleteTodos(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {isLoading ? (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ) : (
        <div data-cy="TodoLoader" className="modal overlay" />
      )}
    </div>
  );
};
