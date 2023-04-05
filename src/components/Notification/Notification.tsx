/* eslint-disable jsx-a11y/control-has-associated-label */
import './Notification.scss';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  message: ErrorMessage;
  onClose: () => void;
};

export const Notification: FC<Props> = ({
  message,
  onClose,
}) => {
  const [error, setError] = useState(ErrorMessage.EMPTY_TITLE);

  useEffect(() => {
    if (message) {
      setError(message);
    }
  }, [message]);

  return (
    <div
      className={classNames(
        'Notification notification is-danger is-light has-text-weight-normal',
        { 'Notification--hidden': !message },
      )}
    >
      <button
        type="button"
        className="Notification__button delete"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
