/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onErrorMessageChange: (error: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  onErrorMessageChange,
}) => {
  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      onErrorMessageChange('');
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessageChange('')}
      />
      {errorMessage}
    </div>
  );
};
