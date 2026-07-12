/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDelete: (id: number) => void;
  isLoading: boolean;
  handleToggle: (id: number, data: Partial<Todo>) => void;
  handleStartEditing: (id: number, todoTitle: string) => void;
  editingTodoId: number | null;
  handleCancelEditing: () => void;
  editedTitle: string;
  handleRenameTodo: (id: number, todoTitle: string) => void;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  isLoading,
  handleToggle,
  handleStartEditing,
  editingTodoId,
  handleCancelEditing,
  editedTitle,
  handleRenameTodo,
  setEditedTitle,
}) => {
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
          onChange={() =>
            handleToggle(todo.id, {
              completed: !todo.completed,
            })
          }
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          autoFocus
          onChange={event => setEditedTitle(event.target.value)}
          onBlur={() => handleRenameTodo(todo.id, todo.title)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              handleCancelEditing();
            }

            if (event.key === 'Enter') {
              handleRenameTodo(todo.id, todo.title);
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleStartEditing(todo.id, todo.title)}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className={'modal-background has-background-white-ter'} />
        <div className="loader" />
      </div>
    </div>
  );
};
