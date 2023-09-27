import classnames from 'classnames';
import { useTodoTemp } from '../../context/TodoTempContext';

type Props = {
  isActive: boolean;
};

export const TodoTempItem: React.FC<Props> = ({ isActive }) => {
  const { todoTemp } = useTodoTemp();

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todoTemp?.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay', {
            'is-active': isActive,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
