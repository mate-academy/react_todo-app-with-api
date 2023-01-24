import React, { useState } from 'react';

type Props = {
  emptyFieldError: boolean,
  failedAddError: boolean,
  failedDeleteError: boolean,
  failedLoadError: boolean,
  failedChangeError: boolean,
};

export const ErrorNotification: React.FC<Props> = ({
  emptyFieldError,
  failedAddError,
  failedDeleteError,
  failedLoadError,
  failedChangeError,
}) => {
  const [closed, setClosed] = useState(false);

  const canselErrors = () => {
    setClosed(false);
  };

  const isError = () => {
    if (emptyFieldError || failedAddError
      || failedDeleteError || failedLoadError || failedChangeError) {
      return true;
    }

    return false;
  };

  return (
    <>
      {isError() && !closed && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setClosed(true);
              setTimeout(canselErrors, 3000);
            }}
          >
            Close Error
          </button>
          {emptyFieldError && 'Title can not be empty \n'}
          {failedAddError && 'Unable to add a todo \n'}
          {failedDeleteError && 'Unable to delete a todo \n'}
          {failedLoadError && 'Unable to load a todo \n'}
          {failedChangeError && 'Unable to update a todo \n'}
        </div>
      )}
    </>
  );
};
