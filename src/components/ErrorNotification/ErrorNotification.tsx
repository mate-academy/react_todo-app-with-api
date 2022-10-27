import classNames from 'classnames';

type Props = {
  removeError: (boolean: boolean) => void
  error: boolean
  errorMessage: string | null
  setError: (boolean: boolean) => void
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  removeError,
  errorMessage,
  setError,
}) => {
  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !error,
          })}
      >
        <button
          aria-label="press button to delete"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => removeError(false)}
        />
        {errorMessage}
      </div>
    </>
  );
};
