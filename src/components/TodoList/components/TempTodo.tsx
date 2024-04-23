/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../../types/Todo';

type Props = { tempTodo: Todo };

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  const { completed, title, id } = tempTodo;

  return (
    <div data-cy="Todo" className={'todo'} key={id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
