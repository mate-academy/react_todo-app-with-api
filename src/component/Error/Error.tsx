import React, { useMemo, useState } from 'react';

interface Props {
  error: string;
  closeErrorBanner: (value: string) => void;
}

export const Error: React.FC<Props> = ({ error, closeErrorBanner }) => {
  const handlerClick = () => {
    closeErrorBanner('');
  };

  const [isError, setIsError] = useState<string>(error);

  useMemo(() => {
    setIsError(error);

    const timeout = setTimeout(() => {
      closeErrorBanner('');
      setIsError('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, closeErrorBanner]);

  const showErrorBanner = isError.length > 0
    ? 'notification is-danger is-light has-text-weight-normal'
    : 'notification is-danger is-light has-text-weight-normal hidden';

  return (
    <>

      <div
        className={showErrorBanner}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          id="errorButton"
          className="delete"
          aria-label="Close"
          data-cy="HideErrorButton"
          onClick={handlerClick}
        />
        {isError}
      </div>
    </>
  );
};
