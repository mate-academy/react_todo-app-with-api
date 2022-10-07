import classNames from 'classnames';
import { useEffect } from 'react';
import { TextError } from '../types/TextError';

interface Props {
  hasLoadError: string;
  setHasLoadError: (event: TextError) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  hasLoadError,
  setHasLoadError,
}) => {
  const clouseError = () => {
    setHasLoadError(TextError.None);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoadError(TextError.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasLoadError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: hasLoadError === TextError.None },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="HideErrorButton"
        className="delete"
        onClick={clouseError}
      />
      {hasLoadError}
    </div>
  );
};
