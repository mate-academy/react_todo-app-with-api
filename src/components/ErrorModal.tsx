import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: string;
  onClearError: () => void;
};

export const ErrorModal: React.FC<Props> = ({ errorMessage, onClearError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage || errorMessage === Errors.DEFAULT },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClearError}
      />
      {errorMessage}
    </div>
  );
};
