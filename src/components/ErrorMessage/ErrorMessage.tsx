/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  message: string,
  setMessage: (message: string) => void,
};

export const ErrorMessage: React.FC<Props> = ({ message, setMessage }) => {
  useEffect(() => {
    setInterval(() => {
      setMessage('');
    }, 3000);
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: message === '' },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setMessage('')}
      />
      {message}
    </div>
  );
};
