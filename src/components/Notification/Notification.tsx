import React, { useEffect } from 'react';

interface Props {
  message: string;
  handleError: (value: string) => void;
}

export const Notification: React.FC<Props> = ({ message, handleError }) => {
  const autoDelete = () => {
    setTimeout(() => {
      handleError('');
    }, 3000);
  };

  useEffect(() => {
    autoDelete();
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label  */}
      <button
        type="button"
        className="delete"
        onClick={() => handleError('')}
      />
      <br />
      {message}
    </div>
  );
};
