/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types';

type Props = {
  isLoadingTodo: boolean;
  isEditing: boolean;
  todo: Todo;
  handleUpdateTodo?: (originalTodo: Todo, updatedTodo: Todo) => void;
  handleTodoEditing?: (todo: Todo) => void;
  editInputRef?: React.RefObject<HTMLInputElement>;
  editedTodoTitle?: string;
  setEditedTodoTitle?: (value: string) => void;
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setEditingTodoId?: (id: number | null) => void;
  handleDeleteTodo?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  isLoadingTodo,
  isEditing,
  todo,
  handleUpdateTodo = () => {},
  handleTodoEditing = () => {},
  editInputRef,
  editedTodoTitle = '',
  setEditedTodoTitle = () => {},
  handleKeyDown = () => {},
  setEditingTodoId = () => {},
  handleDeleteTodo = () => {},
}) => {
  const handleToggleComplete = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    handleUpdateTodo(todo, updatedTodo);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled={isLoadingTodo}
          checked={todo.completed}
          onChange={handleToggleComplete}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={editingEvent => {
            editingEvent.preventDefault();
            handleTodoEditing(todo);
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTodoTitle}
            onChange={todoEvent => setEditedTodoTitle(todoEvent.target.value)}
            onBlur={() => handleTodoEditing(todo)}
            onKeyUp={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTodoTitle(todo.title);
              setEditingTodoId(todo.id);
            }}
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
        className={cn('modal overlay', {
          'is-active': isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
