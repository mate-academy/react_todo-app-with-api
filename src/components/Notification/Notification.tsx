import { FC } from 'react';
import cn from 'classnames';
import { Error } from '../../types';

type Props = {
  error: Error;
  onReset: () => void;
};

export const Notification: FC<Props> = ({ error, onReset }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onReset}
      />
      {error}
    </div>
  );
};
