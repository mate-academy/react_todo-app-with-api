import { FC } from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  onCloseError: () => void;
}

export const Error: FC<Props> = ({ error, onCloseError }) => {
  return (
    <div className={cn('notification', 'is-danger',
      'is-light', 'has-text-weight-normal', { hidden: !error })}
    >
      <button
        aria-label="closeErrorBtn"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {error}
    </div>
  );
};
