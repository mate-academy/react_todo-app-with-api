import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => Promise<void>;
  selectedId: number[];
  isAdding: boolean;
  todoStatus: boolean,
  handleOnChange: (updateId: Todo) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedId,
  isAdding,
  todoStatus,
  handleOnChange,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
          onChange={() => handleOnChange(todo)}

        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        ×
      </button>
      { selectedId.includes(todo.id) && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}

      { (isAdding && todo.id === 0) && (
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
