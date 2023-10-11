import cn from 'classnames';
import { useTodo } from '../providers/AppProvider';

type Props = {
  todoId: number,
};

export const Loader = ({ todoId }: Props) => {
  const { isLoading, editedTodo } = useTodo();

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading && editedTodo?.id === todoId,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
