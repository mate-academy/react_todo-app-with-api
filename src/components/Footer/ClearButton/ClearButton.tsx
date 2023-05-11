import classNames from 'classnames';

interface Props {
  isCompletedExist: boolean;
  onDelete: () => Promise<void>;
}

export const ClearButton: React.FC<Props> = ({
  isCompletedExist,
  onDelete,
}) => {
  return (
    <button
      type="button"
      className={classNames('todoapp__clear-completed', {
        'todoapp__clear-completed--hide': !isCompletedExist,
      })}
      onClick={onDelete}
    >
      Clear completed
    </button>
  );
};
