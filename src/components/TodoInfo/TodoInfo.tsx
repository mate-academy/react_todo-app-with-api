import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  removeTodo: (id:number) => void;
  onHandleStatusTodo: (id:number, completed:boolean) => void;
  updatingTodo: Todo | null,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  onHandleStatusTodo,
  updatingTodo,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

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
          checked={completed}
          onChange={() => {
            onHandleStatusTodo(id, completed);
          }}
        />
      </label>

      <span
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>
      <div
        className={classNames('modal overlay',
          { 'is-active': isLoading || updatingTodo?.id === id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
