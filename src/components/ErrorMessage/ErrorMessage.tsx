import classNames from 'classnames';

type ErrorProps = {
  errorMessage: string | boolean | null;
  onErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

export function Error({ errorMessage, onErrorMessage }: ErrorProps) {
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
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(null)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
}
