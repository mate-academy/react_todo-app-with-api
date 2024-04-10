import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isSubmitting: boolean;
  deletedTodoId: number;
  handleRemoveTodo: (todoId: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoElement: React.FC<Props> = ({
  todo,
  isSubmitting,
  deletedTodoId,
  handleRemoveTodo,
  handleUpdateTodo,
}) => {
  const { title, completed } = todo;

  const handleToggleTodo = () => {
    const updatedTodo = { ...todo, completed: !completed };

    handleUpdateTodo(updatedTodo);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" onClick={handleToggleTodo}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            (isSubmitting && todo.id === 0) ||
            (isSubmitting && todo.id === deletedTodoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
