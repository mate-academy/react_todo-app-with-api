import classNames from 'classnames';
import { useEffect } from 'react';
import { ErrorsType } from '../../types/ErrorsType';

type NotificationsProps = {
  errors: ErrorsType;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>;
};

export const Notifications: React.FC<NotificationsProps> = ({
  errors,
  setErrors,
}) => {
  const handleCLoseNotifications = () => {
    setErrors({
      load: false,
      delete: false,
      empty: false,
      add: false,
      edit: false,
    });
  };

  useEffect(() => {
    // hide after 3 seconds
    const hideNotificationTimer = setTimeout(() => {
      handleCLoseNotifications();
    }, 3000);

    // clean up the timer
    return () => {
      clearTimeout(hideNotificationTimer);
    };
  }, [errors]);

  const checkErrors
    = !errors.load && !errors.delete
    && !errors.empty && !errors.add && !errors.edit;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: checkErrors },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete-notification"
        onClick={handleCLoseNotifications}
      />

      {/* show only one message at a time */}
      {errors.load && (
        <>
          Unable to load todos
          <br />
        </>
      )}

      {errors.delete && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}

      {errors.empty && (
        <>
          Title can`t be empty
          <br />
        </>
      )}

      {errors.add && (
        <>
          Unable to add a todo
          <br />
        </>
      )}

      {errors.edit && (
        <>
          Unable to update a todo
          <br />
        </>
      )}
    </div>
  );
};
