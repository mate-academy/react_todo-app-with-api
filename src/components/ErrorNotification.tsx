import React, { useEffect } from 'react';
import classnames from 'classnames';

type Props = {
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({
  message, setMessage,
}) => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  });

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classnames({
          notification: true,
          'is-danger': true,
          'is-light': true,
          'has-text-weight-normal': true,
          hidden: !setMessage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="hide-error-button"
          onClick={() => setMessage('')}
        />

        {message}
        <br />
      </div>
    </>
  );
};
