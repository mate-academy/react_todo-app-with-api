/* eslint-disable no-console */
import classNames from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface Props {
  todo: Todo;
  key: number;
  onDelete: (todo: Todo) => void;
}

export const TodoCard: FC<Props> = (props) => {
  const { todo, key, onDelete } = props;

  return (
    <div
      data-cy="Todo"
      // eslint-disable-next-line quote-props
      className={classNames('todo', { 'completed': todo.completed })}
      key={key}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => {
            client.patch(`/todos/${todo.id}`, { completed: !todo.completed });
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          client.delete(`/todos/${todo.id}`);
          onDelete(todo);
        }}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
