import cn from 'classnames';
import { FC, useCallback, useMemo } from 'react';
import { LoadError } from '../types/LoadError';
import { debounce } from '../utils/debounce';

interface Props {
  loadError: LoadError,
  setError: React.Dispatch<React.SetStateAction<LoadError>>,
}

export const ErrorNotification:FC<Props> = ({ loadError, setError }) => {
  const disableError = useCallback(() => {
    setError((current) => ({
      ...current,
      status: false,
    }));
  }, [setError]);

  const debouncedDisableError = useMemo(() => (
    debounce(disableError, 3000)
  ), [disableError]);

  if (loadError.status) {
    debouncedDisableError();
  }

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !loadError.status,
      })}
    >
      <button
        aria-label="Close notification"
        type="button"
        className="delete"
        onClick={disableError}
      />

      {loadError.message}
    </div>
  );
};
