import { Props } from './ErrorNotificationPropTypes';

export const ErrorNotification : React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  setTimeout(() => setErrorMessage(''), 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {`Unable to ${errorMessage}`}
    </div>
  );
};
