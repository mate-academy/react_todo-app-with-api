import { FC, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { ErrorInfoProps } from './ErrorInfoProps';

export const ErrorInfo: FC<ErrorInfoProps> = ({
  visibleError,
  setError,
}) => {
  const removeError = useCallback(() => {
    setError('');
  }, [setError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visibleError) {
        removeError();
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeError, visibleError]);

  return (
    <div className={cn(
      'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
      {
        hidden: !visibleError,
      },
    )}
    >
      <button
        aria-label="remove-error"
        type="button"
        className="delete"
        onClick={removeError}
      />
      {visibleError}
      <br />
    </div>
  );
};
