import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => void;
};

export const TodoData: React.FC<Props> = React.memo(({
  todo,
  handleDeleteTodo,
  changingTodosId,
  handleToggleTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleToggleTodo(id, completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {changingTodosId.includes(id) && <Loader />}

    </div>
  );
});
