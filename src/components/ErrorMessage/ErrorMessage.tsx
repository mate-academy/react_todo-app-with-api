import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import './ErrorMessage.scss';

interface Props {
  errorToShow: ErrorType;
  setErrorToShow: React.Dispatch<React.SetStateAction<ErrorType>>,
}

enum Error {
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  none = '',
  emptyTitle = 'Title can\'t be empty',
}

export const ErrorMessage: React.FC<Props> = ({
  errorToShow,
  setErrorToShow,
}) => {
  const notification = useRef<HTMLDivElement>(null);

  const hideError = useCallback(() => {
    if (notification.current) {
      notification.current.classList.add('hidden');
      setErrorToShow('none');
    }
  }, [errorToShow]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (errorToShow !== 'none' && notification.current) {
      notification.current.classList.remove('hidden');
      timerId = setTimeout(() => hideError(), 3000);
    }

    return () => clearTimeout(timerId);
  }, [errorToShow]);

  const handleHideError = () => {
    hideError();
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        'hidden',
      )}
      ref={notification}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      { Error[errorToShow] }
    </div>
  );
};
