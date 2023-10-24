import React from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const {
    deleteTodo,
    toggleTodo,
  } = React.useContext(TodosContext);

  const { completed, title, id } = todo;

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => !isLoading && toggleTodo(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { title }
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
