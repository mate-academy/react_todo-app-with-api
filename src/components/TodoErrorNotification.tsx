/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface TodoErrorNotificationProps {
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
}
export const TodoErrorNotification: React.FC<TodoErrorNotificationProps> = ({ error, setError }) => {
  useEffect(() => {
    const hideErrorTimeout = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, [error]);

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
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
