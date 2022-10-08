import { ErrorMessage } from '../../types/ErrorMessage';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  onErrorMessage: (errorType: ErrorMessage) => void;
  errorMessage: ErrorMessage,
};

export const ErrorNotification: React.FC<Props> = ({
  onErrorMessage,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(ErrorMessage.none)}
      />

      {errorMessage}
    </div>
  );
};
