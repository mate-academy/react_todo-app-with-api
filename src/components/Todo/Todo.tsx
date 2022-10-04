import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  deleteTodo: (todo: Todo) => void;
  visibleLoader: boolean;
  setVisibleLoader: (loader: boolean) => void;
  updateCompleteTodo: (todo: Todo) => void;
};

export const UserTodo: React.FC<Props> = ({
  todo,
  deleteTodo,
  visibleLoader,
  setVisibleLoader,
  updateCompleteTodo,
}) => {
  const addCompleteTodo = () => {
    updateCompleteTodo(todo);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={addCompleteTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          setVisibleLoader(true);

          return deleteTodo({
            title: todo.title,
            userId: todo.userId,
            id: todo.id,
            completed: todo.completed,
          });
        }}
      >
        ×
      </button>

      {visibleLoader && (
        <Loader />
      )}
    </div>
  );
};
