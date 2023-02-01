import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  isActive?: boolean,
  isDeleting?: boolean,
  isUpdating?: boolean | Todo,
};

export const TodoLoader: React.FC<Props> = ({
  isActive,
  isDeleting,
  isUpdating,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal overlay',
        { 'is-active': isActive || isDeleting || isUpdating },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
