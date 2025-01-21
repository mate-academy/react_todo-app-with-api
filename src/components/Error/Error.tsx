import React, { useEffect } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  hasError: Errors;
  setHasError: (hasError: Errors) => void;
}
export const Error: React.FC<Props> = props => {
  const { hasError, setHasError } = props;

  useEffect(() => {
    if (hasError !== Errors.NoError) {
      const timer = setTimeout(() => {
        setHasError(Errors.NoError);
      }, 3000);

      return () => clearTimeout(timer);
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setHasError(Errors.NoError);
        }}
      />

      {hasError}
    </div>
  );
};
