import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoProvider';

type TodoLoaderProps = {
  taskId: number;
};

export const TodoLoader = ({ taskId }: TodoLoaderProps) => {
  const { isUpdating } = useTodoContext();

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay ', {
        'is-active': isUpdating.includes(taskId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
