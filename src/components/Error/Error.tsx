import { FC } from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  onCloseError: () => void;
}

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Error: FC<Props> = ({ error, onCloseError }) => {
  return (
    <div className={cn('notification', 'is-danger',
      'is-light', 'has-text-weight-normal', { hidden: !error })}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {error}
    </div>
  );
};
