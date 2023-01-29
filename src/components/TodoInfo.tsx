import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deletingTodosIds: number[],
  updatingTodosIds: number[],
  handleDeleteTodo: (id: number) => void,
  updateTodo: (todoToChange: Todo) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deletingTodosIds,
  updatingTodosIds,
  handleDeleteTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [changingTodoTitle, setChangingTodoTitle] = useState(todo.title);

  const todoTitleField = useRef<HTMLInputElement>(null);

  const isProcessingWithLoaderOverlay = deletingTodosIds
    .includes(todo.id || 0) || updatingTodosIds.includes(todo.id || 0);

  const onChangeTodoStatus = () => {
    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  const onChangeTodoTitle = () => {
    if (changingTodoTitle.length === 0) {
      handleDeleteTodo(todo.id || 0);
      setIsEditing(false);
    }

    if (changingTodoTitle !== todo.title) {
      const todoToChange = {
        id: todo.id,
        ...todo,
      };

      todoToChange.title = changingTodoTitle;

      updateTodo(todoToChange);
      setIsEditing(false);
    }

    setIsEditing(false);
  };

  const cancelOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onChangeTodoStatus()}
        />
      </label>

      {isEditing ? (
        <form onSubmit={() => onChangeTodoTitle()}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            ref={todoTitleField}
            onBlur={onChangeTodoTitle}
            onKeyDown={cancelOnKeyDown}
            placeholder="Empty Todo will be deleted"
            value={changingTodoTitle}
            onChange={event => setChangingTodoTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(todo.id || 0)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessingWithLoaderOverlay,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
