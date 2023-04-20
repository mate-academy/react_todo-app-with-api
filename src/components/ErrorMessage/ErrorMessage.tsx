import React, { useContext } from 'react';
import classNames from 'classnames';

import { AppContext } from '../AppContext';

export const ErrorMessage: React.FC = React.memo(() => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(AppContext);

  const handleCloseButtonClick = () => {
    setErrorMessage('');
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="Close"
        type="button"
        className="delete"
        onClick={handleCloseButtonClick}
      />

      {errorMessage}
    </div>
  );
});
