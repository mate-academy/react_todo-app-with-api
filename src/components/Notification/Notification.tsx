/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, memo, useMemo } from 'react';
import { Error } from '../../types/Error';
import { GetError } from '../../types/functions';

interface Props {
  error: Error;
  setError: GetError;
}

export const Notification: FC<Props> = memo(({
  error,
  setError,
}) => {
  const errorMessage = useMemo(() => {
    switch (error) {
      case Error.Empty:
        return "Title can't be empty!";

      case Error.Get:
        return `Unable to ${error} a todos`;

      case Error.Add:
        return `Unable to ${error} a todo`;

      case Error.Delete:
        return `Unable to ${error} a todo`;

      case Error.Update:
        return `Unable to ${error} a todo`;

      default:
        return Error.None;
    }
  }, [error]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Error.None)}
      />
      {errorMessage}
    </div>
  );
});
