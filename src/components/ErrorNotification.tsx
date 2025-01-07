import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  error: string;
  setError: (errorMessege: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (error.length !== 0) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setError('');
      }, 3000);
    }
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
