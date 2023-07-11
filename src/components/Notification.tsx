import classNames from 'classnames';
import React from 'react';

interface Props {
  isError: string | null,
  setIsError: (value: string | null) => void,
}

export const Notification: React.FC<Props> = ({
  isError,
  setIsError,
}) => {
  const closeErrorWindow = () => {
    setIsError(null);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        aria-label="close"
        className="delete"
        onClick={closeErrorWindow}
      />
      {isError}
    </div>
  );
};
