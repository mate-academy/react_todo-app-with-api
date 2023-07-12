import cn from 'classnames';
import {
  FC, memo, useCallback, useEffect, useRef,
} from 'react';

interface Props {
  loadError: string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
}

export const ErrorNotification:FC<Props> = memo(({ loadError, setError }) => {
  const disableError = useCallback(() => {
    setError(null);
  }, [setError]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(disableError, 3000);
  }, [loadError]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !loadError,
      })}
    >
      <button
        aria-label="Close notification"
        type="button"
        className="delete"
        onClick={disableError}
      />

      {loadError}
    </div>
  );
});
