import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorMessage: ErrorMessages,
  hideErrors: () => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  hideErrors,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="Hide Errors"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrors}
      />
      {errorMessage}
    </div>
  );
};
