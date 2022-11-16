import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleDelete: (todoId: number) => void;
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleChange,
  handleDelete,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChange(id, { completed: !completed })}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>
    </div>
  );
};
