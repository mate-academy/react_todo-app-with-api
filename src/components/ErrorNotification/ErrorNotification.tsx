import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage;
  setError: (value: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorMessage.None)}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
