/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { EditTodoForm } from '../EditTodoForm';
interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onCheck?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onCheck,
}) => {
  const { id, completed, title } = todo;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleChangeCompleted = () => {
    if (onCheck) {
      onCheck(todo);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCompleted}
        />
      </label>

      <EditTodoForm id={id} title={title} onDelete={handleDelete} />

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
