/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

type Props = {
  message: string,
  setMessage: (errorMessage: string) => void,
};

export const Notification: FC<Props> = ({ message, setMessage }) => (
  <div
    data-cy="Notification"
    className="notification is-danger is-light has-text-weight-normal"
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setMessage('')}
    />
    {message}
  </div>
);
