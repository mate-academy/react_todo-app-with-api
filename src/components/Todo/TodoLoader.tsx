import cn from 'classnames';
import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../store/todoContext';

type Props = {
  todo: Todo;
  isDeleting: boolean;
};

export const TodoLoader: FC<Props> = ({ todo, isDeleting }) => {
  const { isLoading, isTogglingAll, isUpdating } = useTodoContext();

  // prettier-ignore
  const isActive = todo && (todo.id === 0
    || isDeleting
    || (isLoading && todo.completed)
    || isUpdating === todo.id
    || isTogglingAll);

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
