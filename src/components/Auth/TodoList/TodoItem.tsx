import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => Promise<void>;
  selectedIds: number[];
  isAdding: boolean;
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedIds,
  isAdding,
  handleOnChange,
}) => {
  const loaderCondition = selectedIds.includes(todo.id)
    || (isAdding && todo.id === 0);

  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
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
          onChange={() => handleOnChange(id, { completed: !completed })}

        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(id);
        }}
      >
        ×
      </button>
      { loaderCondition && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}
    </div>
  );
};
