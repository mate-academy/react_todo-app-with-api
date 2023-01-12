import React from 'react';

type Props = {
  errorMessages: string[];
  // eslint-disable-next-line no-empty-pattern
  setErrorMessages: ([]) => void;
};

export const Notification: React.FC<Props> = (props) => {
  const { errorMessages, setErrorMessages } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessages([])}
      />

      {errorMessages.map(error => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
};
