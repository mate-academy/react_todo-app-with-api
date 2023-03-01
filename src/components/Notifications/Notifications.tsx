import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Clear error"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
