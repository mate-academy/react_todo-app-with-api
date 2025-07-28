import cn from 'classnames';
import React from 'react';

type Props = {
  message: string;
  onCleaning: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onCleaning }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCleaning}
      />

      <p>{message}</p>
    </div>
  );
};
