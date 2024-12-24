import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  loadingTodoId: number | null;
  todo: Todo;
};

export const TodoLoader: React.FC<Props> = ({ todo, loadingTodoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal',
        'overlay',
        loadingTodoId === todo.id && 'is-active',
      )}
    >
      <div
        className="modal-background
                   has-background-white-ter"
      />
      <div className="loader" />
    </div>
  );
};
