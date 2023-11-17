import className from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null,
  isSubmitted: boolean,
};

export const TodoLoadingItem: React.FC<Props> = ({ tempTodo, isSubmitted }) => {
  return (
    <>
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo?.title}
        </span>
        <div
          data-cy="TodoLoader"
          className={className('modal', 'overlay', {
            'is-active': isSubmitted,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
