import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const timerIdRef = useRef<string>(errorMessage);

  timerIdRef.current = errorMessage;

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(timerIdRef.current);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        onClick={() => (setErrorMessage(''))}
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
