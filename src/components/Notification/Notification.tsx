/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';
import { useAppContext } from '../AppProvider';

export const Notification: React.FC = () => {
  const {
    errorMessage,
    setIsNotificationVisible,
    isNotificationVisible,
  } = useAppContext();

  useEffect(() => {
    if (isNotificationVisible) {
      setTimeout(setIsNotificationVisible, 3000, false);
    }
  }, [isNotificationVisible]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isNotificationVisible },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsNotificationVisible(false)}
      />
      {errorMessage}
    </div>
  );
};
