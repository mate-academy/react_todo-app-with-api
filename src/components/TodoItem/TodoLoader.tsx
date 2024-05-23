import cn from 'classnames';
import { useTodosContext } from '../../context/TodosContext';
import { Todo } from '../../types/Todo';

type TodoLoaderProps = {
  todo: Todo;
};

export const TodoLoader: React.FunctionComponent<TodoLoaderProps> = ({
  todo,
}) => {
  const { loadingIds } = useTodosContext();

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': loadingIds?.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
