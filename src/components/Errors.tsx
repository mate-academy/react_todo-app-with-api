import React, { useState } from 'react';
import classNames from 'classnames';
import { Error } from '../types/Error';

interface ErrorProps {
  errorType: Error,
}

export const ErrorMessage: React.FC<ErrorProps> = ({ errorType }) => {
  const [isHidden, setIsHidden] = useState(false);
  const handleNotification = () => {
    setIsHidden(true);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleNotification}
      >
        x
      </button>
      {errorType}
    </div>
  );
};
