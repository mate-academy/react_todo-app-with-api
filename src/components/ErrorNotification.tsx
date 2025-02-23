/* eslint-disable react/display-name */
import classNames from 'classnames';
import { memo } from 'react';

interface Props {
  error: string;
  setError: () => void;
}

export const ErrorNotification = memo(({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={setError}
      />
      {error}
    </div>
  );
});
