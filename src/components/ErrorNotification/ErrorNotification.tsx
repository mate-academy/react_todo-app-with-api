import classNames from 'classnames';
import React from 'react';

interface Props {
  errorMessage: string;
}

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => (
  <>
    {/* DON'T use conditional rendering to hide the notification */}
    {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  </>
);
