import { ErrorMessage } from '../types/ErrorMessage';

type ErrorNotificationProps = {
  error: ErrorMessage | null;
  onHide: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onHide,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {error && <p>{error}</p>}
    </div>
  );
};
