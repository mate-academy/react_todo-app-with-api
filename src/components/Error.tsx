import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessages';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
}

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.NoError)}
      />
      {errorMessage}
    </div>
  );
};
