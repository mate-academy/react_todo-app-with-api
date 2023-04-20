import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  processedIds: number[],
  handleCheckbox: (id: number, value: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  processedIds,
  handleCheckbox,
}) => {
  return (
    <div
      className={classNames('todo', { 'completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleCheckbox(todo.id, todo.completed)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay', {
          'is-active': todo.id === 0 || processedIds.includes(todo.id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
