import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingTodosId: number[];
};

export const TodoLoader: React.FC<Props> = ({ todo, loadingTodosId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingTodosId.includes(todo.id),
      })}
    >
      <div
        className="modal-background has-background-white-ter"
      />
      <div className="loader" />
    </div>
  );
};
