import classNames from 'classnames';

interface Props {
  error: string,
  setHideError: (value: boolean) => void,
  hideError: boolean,
  setError: (value: string) => void
}

export const ErrorMessage: React.FC<Props> = ({
  error,
  setHideError,
  hideError,
  setError,
}) => {
  if (error.length > 0) {
    setTimeout(() => {
      setError('');
      setHideError(false);
    }, 3000);
  }

  return (
    <>
      {error.length > 0 && (
        <div
          data-cy="ErrorNotification"
          className={
            classNames(
              'notification is-danger is-light has-text-weight-normal',
              {
                hidden: hideError,
              },
            )
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            aria-label="delete"
            className="delete"
            onClick={() => setHideError(true)}
          />
          {error}
        </div>
      )}
    </>
  );
};
