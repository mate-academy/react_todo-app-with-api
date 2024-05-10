import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loader: boolean;
}

export const TodoItem = ({ todo, loader }: Props) => (
  <div data-cy="Todo" className="todo" key={todo.id}>
    <label className="todo__status-label" aria-labelledby={`todo_${todo.id}`}>
      <input
        id={`todo_${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': loader,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
