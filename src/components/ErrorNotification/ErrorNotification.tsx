import classNames from 'classnames';
import '../../styles/todoapp.scss';
import { ErrorMessage } from '../../types/ErrorMessages';

interface Props {
  setErrorMessage: (message: ErrorMessage | '') => void;
  errorMessage: string;
}

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
