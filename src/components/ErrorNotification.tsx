import { useEffect, useState } from 'react';
import classNames from 'classnames';

interface Props {
  error: string,
}

export const ErrorNotification: React.FC<Props> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(false);

  const handleHidden = () => {
    setIsHidden(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleHidden();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleHidden}
      >
        <span className="visually-hidden">Close</span>
      </button>
      {error}
    </div>
  );
};
