/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type SingleTodoProps = {
  todo: Todo,
  handleRemove: (todoId: number) => void,
  deletedTodosId: number[],
  handleToggleCompleted: (id: number) => void,
};

export const SingleTodo
= ({
  todo, handleRemove, deletedTodosId, handleToggleCompleted,
}: SingleTodoProps) => {
  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          data-cy="TodoStatus"
          onChange={() => handleToggleCompleted(todo.id)}
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>
      <button
        type="button"
        data-cy="TodoDelete"
        className="todo__remove"
        onClick={() => handleRemove(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodosId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
