import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  onCheckedToggle: (value: Todo) => void,
  onUpdatingForm: (value: Todo | null) => void,
  onDelete: (value: number) => void,

  isAllTodosLoading: boolean,
  isTodoLoading: Todo | null,
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  onCheckedToggle,
  onUpdatingForm,
  onDelete,

  isAllTodosLoading,
  isTodoLoading,
  todo,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          'todo completed': todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => onCheckedToggle(todo)}
          />
        </label>

        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onUpdatingForm(todo)}
        >
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isTodoLoading?.id === todo.id || isAllTodosLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
