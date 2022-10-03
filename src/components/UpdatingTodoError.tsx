import classNames from 'classnames';

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  setUpdateTodoError: (err: boolean) => void;
};

export const UpdatingTodoError: React.FC<Props> = ({
  closeError, error, setUpdateTodoError,
}) => {
  const handleWindowClose = () => {
    setUpdateTodoError(false);
    closeError(true);
  };

  setTimeout(() => {
    setUpdateTodoError(false);
    closeError(true);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: error },
      )}
    >
      <button
        aria-label="Hide Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleWindowClose}
      />
      Unable to update a todo
    </div>
  );
};
