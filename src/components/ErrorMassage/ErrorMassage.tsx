import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { errorMassages } from '../../utils/errorMassages';

type Props = {
  errorMassage: ErrorType,
  closeError: () => void,
  isError: boolean,
};

export const ErrorMassage: React.FC<Props> = React.memo(({
  errorMassage,
  closeError,
  isError,
}) => {
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        closeError();
      }, 3000);
    }
  }, [isError]);

  useEffect(() => {
    errorMassages(errorMassage, setError);
  }, [errorMassage]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !isError,
        },
      )}
    >
      <button
        aria-label="delete error"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {error}
    </div>
  );
});
