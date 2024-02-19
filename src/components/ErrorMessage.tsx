import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Error } from '../types/Error';

interface Props {
  error: Error | null;
  close: () => void;
}

export const ErrorMessage: React.FC<Props> = memo(({ error, close }) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleClick = () => {
    setIsVisible(false);
    close();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      close();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [close]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          visible: isVisible,
          hidden: !isVisible,
        },
      )}
    >
      <button
        aria-label="Close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClick}
      />
      <p>{error}</p>
    </div>
  );
});
