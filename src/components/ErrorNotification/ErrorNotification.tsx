import React, { useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  errors: Errors,
};

export const ErrorNotification: React.FC<Props> = ({
  errors,
}) => {
  const [closed, setClosed] = useState(false);

  const canselErrors = () => {
    setClosed(false);
  };

  const isError = () => {
    if (errors.emptyField || errors.failedAdd
      || errors.failedDelete || errors.failedLoad || errors.failedChange) {
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
          {errors.emptyField && 'Title can not be empty \n'}
          {errors.failedAdd && 'Unable to add a todo \n'}
          {errors.failedDelete && 'Unable to delete a todo \n'}
          {errors.failedLoad && 'Unable to load a todo \n'}
          {errors.failedChange && 'Unable to update a todo \n'}
        </div>
      )}
    </>
  );
};
