import classNames from 'classnames';
import React from 'react';
import { useAppContext } from '../../HooksContext';

export const ErrorNotifications: React.FC = () => {
  const { errorMessage, setErrorMessage } = useAppContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
        }}
      />
      {errorMessage}
    </div>
  );
};
