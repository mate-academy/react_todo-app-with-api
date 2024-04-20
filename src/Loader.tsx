import cn from 'classnames';

type Props = {
  isLoading: number[];
  todoId: number;
};

export const Loader = ({ isLoading, todoId }: Props) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading.includes(todoId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
