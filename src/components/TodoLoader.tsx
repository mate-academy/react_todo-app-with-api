import classNames from 'classnames';
import Loader from './Loader';

type Props = {
  isLoading: boolean;
};
function TodoLoader({ isLoading }: Props) {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <Loader />
    </div>
  );
}

export default TodoLoader;
