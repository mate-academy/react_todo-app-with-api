import classNames from 'classnames';

type Props = {
  isProcessing: boolean
  todoId: number,
};

export const Loader: React.FC<Props> = ({ isProcessing, todoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal',
        'overlay',
        {
          'is-active': isProcessing || !todoId,
        },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
