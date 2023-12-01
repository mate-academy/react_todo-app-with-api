import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (type: string) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        data-cy="HideErrorButton"
        aria-label="Delete"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
