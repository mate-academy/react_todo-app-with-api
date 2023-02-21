import React from 'react';
import cn from 'classnames';

type Props = {
  hasError: boolean,
  setHasError: (hasError: boolean) => void,
  errorMessage: string,
};

export const Notification: React.FC<Props> = React.memo(({
  hasError,
  setHasError,
  errorMessage,
}) => (
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
));
