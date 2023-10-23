import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string;
  onHandleError: (arg: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  onHandleError,
}) => {
  const closeNotification = () => {
    onHandleError('');
  };

  return (
    <div
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )
      }
    >
      <button
        type="button"
        className="delete"
        onClick={closeNotification}
        aria-label="Close notification"
      />

      {error}
    </div>
  );
};
