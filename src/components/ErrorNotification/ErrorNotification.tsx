import { FC } from 'react';
import { Errors } from '../../utils/enums';

interface Props {
  onError: (error: Errors | null) => void;
  error: Errors
}

export const ErrorNotification:FC<Props> = ({
  onError,
  error,
}) => (
  <div
    className="notification is-danger is-light has-text-weight-normal"
  >
    <button
      aria-label="delete"
      type="button"
      className="delete"
      onClick={() => onError(null)}
    />
    {error}
  </div>
);
