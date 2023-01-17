import { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  setError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setError();
    }, 3000);

    return () => clearTimeout(errorTimer);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: !error })
      }
    >
      <button
        data-cy="HideErrorButton"
        aria-label="delete"
        type="button"
        className="delete"
        onClick={setError}
      />
      {error}
    </div>
  );
};
