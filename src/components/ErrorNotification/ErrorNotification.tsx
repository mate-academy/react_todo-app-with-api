import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  error: boolean,
  SetError: (value: boolean) => void,
  subtitleError: string,
};
export const Notification: React.FC<Props> = ({
  error,
  SetError,
  subtitleError,
}) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => SetError(false),
      1500);

    return () => {
      window.clearInterval(timeout);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close error"
        onClick={() => SetError(false)}
      />
      {subtitleError}
    </div>
  );
};
