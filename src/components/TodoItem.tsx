/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import type { Todo } from '../types/Todo';

export const TodoItem: React.FC<{
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (todoId: number) => Promise<boolean>;
  isDisabled: boolean;
  onUpdateTodo: (todoId: number, changes: Partial<Todo>) => Promise<boolean>;
}> = ({ todo, isLoading, onDeleteTodo, isDisabled, onUpdateTodo }) => {
  const [isEditingTodo, setIsEditingTodo] = React.useState<boolean>(false);
  const [currentTodoTitle, setCurrentTodoTitle] = React.useState<string>(
    todo.title,
  );

  const handleTitleChange = () => {
    const trimmedTitle = currentTodoTitle.trim();

    if (trimmedTitle === '') {
      onDeleteTodo(todo.id).then(isSuccess => {
        if (isSuccess) {
          setIsEditingTodo(false);
        }
      });

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditingTodo(false);

      return;
    }

    onUpdateTodo(todo.id, { title: trimmedTitle }).then(isSuccess => {
      if (isSuccess) {
        setIsEditingTodo(false);
      }
    });
  };

  const startEditingTodo = () => {
    setIsEditingTodo(true);
    setCurrentTodoTitle(todo.title);
  };

  const endEditingTodo = () => {
    setIsEditingTodo(false);
    setCurrentTodoTitle(todo.title);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditingTodo ? (
        <form
          className="todo__title-form"
          onSubmit={e => {
            e.preventDefault();
            handleTitleChange();
          }}
        >
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={currentTodoTitle}
            onChange={e => setCurrentTodoTitle(e.target.value)}
            onBlur={handleTitleChange}
            autoFocus
            onKeyUp={e => {
              if (e.key === 'Escape') {
                endEditingTodo();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditingTodo}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={isDisabled}
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
