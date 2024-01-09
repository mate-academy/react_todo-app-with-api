import { FC, useEffect } from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';

export const Errors: FC = () => {
  const { errorMessage, setErrorMessage } = useAppContext();

  const handleCancelError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCancelError}
      />
      {errorMessage}
    </div>
  );
};
