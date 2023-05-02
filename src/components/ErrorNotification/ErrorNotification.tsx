import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodoContext } from '../../context/TodoContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useTodoContext();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button type="button" className="delete" onClick={() => setError(null)}>
        x
      </button>
      {error}
    </div>
  );
};
