import './TodoErrorNotification.scss';
import { clsx } from 'clsx';
import { ErrorState } from '../../types/ErrorState';
import { useEffect } from 'react';

interface Props {
  errorState: ErrorState;
  onHide: (value: ErrorState) => void;
}

export const TodoErrorNotification = ({ errorState, onHide }: Props) => {
  useEffect(() => {
    let timer: number;

    if (errorState.isVisible) {
      timer = window.setTimeout(() => {
        onHide({
          ...errorState,
          isVisible: false,
        });
      }, 3000);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorState, onHide]);

  return (
    <div
      data-cy="ErrorNotification"
      className={clsx(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorState.isVisible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onHide({ ...errorState, isVisible: false })}
      />
      {errorState.message}
    </div>
  );
};
