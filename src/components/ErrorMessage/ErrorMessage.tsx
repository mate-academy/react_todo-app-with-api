import React from 'react';

type Props = {
  message: string,
  setMessage: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ message, setMessage }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={setMessage}
        aria-label="Close error"
      />
      {message}
    </div>
  );
};
