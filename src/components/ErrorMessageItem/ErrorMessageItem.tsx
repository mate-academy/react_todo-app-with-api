import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage | null;
  handleCloseError: () => void
}

export const ErrorMessageItem: React.FC <Props> = ({
  errorMessage,
  handleCloseError,
}) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      aria-label="delete"
      type="button"
      className="delete"
      onClick={handleCloseError}
    />

    {errorMessage}
    <br />
  </div>
);
