import { FC } from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  closeError: () => void;
}

export const ErrorNotification: FC<Props> = ({ error, closeError }) => (
  <div
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !error,
    })}
  >
    <button
      type="button"
      className="delete"
      aria-label="close"
      onClick={closeError}
    />
    {error}
  </div>
);
