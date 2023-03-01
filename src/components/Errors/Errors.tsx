import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error,
  setErrorWrapper: (value: Error) => void;
  removeError: () => void;
};

export const Errors: React.FC<Props> = React.memo(({
  error,
  setErrorWrapper,
  removeError,
}) => {
  const handleCloseButtonClick = () => {
    setErrorWrapper(Error.NONE);
  };

  useEffect(() => {
    removeError();
  }, [error]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: error === Error.NONE,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => handleCloseButtonClick()}
      />

      {error === Error.EMPTY ? (
        'Title can\'t be empty'
      ) : (
        `Unable to ${error} a todo`
      )}
    </div>
  );
});
