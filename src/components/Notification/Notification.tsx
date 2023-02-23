import React, { useEffect } from 'react';
import cn from 'classnames';
import { warningTimer } from '../../utils/warningTimer';

type Props = {
  hasError: boolean,
  setHasError: (hasError: boolean) => void,
  errorMessage: string,
};

export const Notification: React.FC<Props> = React.memo(({
  hasError,
  setHasError,
  errorMessage,
}) => {
  useEffect(() => {
    if (hasError) {
      warningTimer(setHasError, false, 3000);
    }
  }, [hasError]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        type="button"
        aria-label="delete completed todo"
        className="delete"
        onClick={() => setHasError(false)}
      />

      {errorMessage}
    </div>
  );
});
