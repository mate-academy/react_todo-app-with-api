/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

interface Props {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const timerIdRef = useRef<number>(0);

  useEffect(() => {
    if (timerIdRef.current) {
      window.clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
