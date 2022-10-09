import classNames from 'classnames';
import { Error } from '../../types/Errors';

type Props = {
  error: Error | null;
  setError: (error: Error | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <>
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => setError(null)}
      />

      {error}
    </>
  </div>
);
