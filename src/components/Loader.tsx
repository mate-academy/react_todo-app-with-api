import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  loadingState: boolean;
  todo: Todo;
  activeTodos: Todo[];
};

export const Loader: React.FC<Props> = ({
  loadingState,
  todo,
  activeTodos,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingState && activeTodos.includes(todo),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
