import classNames from 'classnames';
import { useTodosProvider } from '../../../providers/TodosContext';
import { Todo } from '../../../types/Todo';

type TodoLoaderProps = {
  todo: Todo,
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({ todo }) => {
  const { deletedTodosId, updatedTodosId } = useTodosProvider();

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': deletedTodosId.includes(todo.id)
                  || updatedTodosId.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
