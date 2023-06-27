import classNames from 'classnames';
import { useCallback, useEffect } from 'react';
// import { useState } from 'react';

interface Props {
  message: string;
  handleMessage: (error: string) => void;
}

export const Notification: React.FC<Props> = ({
  message,
  handleMessage,
}) => {
  const deleteMessage = useCallback(() => {
    handleMessage('');
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => deleteMessage(), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [message]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !message.length },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <button
        type="button"
        className="delete"
        onClick={deleteMessage}
      />
      {message}
    </div>
  );
};
