import React, { useEffect } from 'react';
import classNames from 'classnames';

import { ErrorType } from '../types/ErrorType';

type Props = {
  setErrors: (value: ErrorType) => void;
  errors: ErrorType,
};

export const Errors: React.FC<Props> = ({ errors, setErrors }) => {
  useEffect(() => {
    setTimeout(() => setErrors(ErrorType.NONE), 3000);
  }, [errors]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errors,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrors(ErrorType.NONE)}
      />
      {errors}
    </div>
  );
};
