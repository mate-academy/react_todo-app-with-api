import classNames from 'classnames';
import { ErrorMessages } from '../../App';

type Props = {
  errorMessage: ErrorMessages | null;
  setError: (value: null) => void;
};

const ErrorNotification: React.FC<Props> = ({ errorMessage, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      <br />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
