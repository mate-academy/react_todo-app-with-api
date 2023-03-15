import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorMessage: string,
};

export const Notifications: React.FC<Props> = ({
  errorMessage,
}) => {
  const [isHidden, setisHidden] = useState(true);

  useEffect(() => {
    const notificationCloser = () => {
      setTimeout(() => {
        setisHidden(true);
      }, 3000);
    };

    if (errorMessage.length) {
      setisHidden(false);
      notificationCloser();
    } else {
      setisHidden(true);
    }
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
      hidden={isHidden}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setisHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
