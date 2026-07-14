import classNames from 'classnames';
import { ErrorProps } from '../../types/ErrorProps';

export const ErrorNotification = ({ error, setError }: ErrorProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        `notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`,
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
