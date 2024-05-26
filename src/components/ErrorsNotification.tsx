import cn from 'classnames';
import { useErrorNotifications } from '../store/Errors';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useErrorNotifications();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
