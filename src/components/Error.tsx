import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodosContext } from '../context';

export const Error = () => {
  const { errorType, setErrorType, isError } = useTodosContext();

  const handleCloseError = () => {
    setErrorType('');
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorType('');
    },
    3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete hidden"
        onClick={handleCloseError}
        aria-label="delete"
      />

      {errorType}
    </div>
  );
};
