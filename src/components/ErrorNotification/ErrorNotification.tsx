import cn from 'classnames';
import { useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';

export const ErrorNotification = () => {
  const {
    errorType,
    setErrorType,
  } = useAppContext();

  useEffect(() => {
    if (errorType.length) {
      setTimeout(() => {
        setErrorType('');
      }, 3000);
    }
  }, [errorType]);

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorType.length < 1 },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorType('')}
      />
      {errorType}
    </div>
  );
};
