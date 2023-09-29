import cn from 'classnames';
import { useEffect } from 'react';
import { useToDoContext } from '../../context/ToDo.context';
import { ErrorMessage } from '../../types/Error';

export const ErrorNotification:React.FC = () => {
  const { errorMessage, showError } = useToDoContext();

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout:NodeJS.Timeout = setTimeout(
      () => showError(ErrorMessage.none), 3000,
    );

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: errorMessage === ErrorMessage.none,
        })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide error!"
        onClick={() => showError(ErrorMessage.none)}
      />
      { errorMessage !== ErrorMessage.none && errorMessage }
    </div>
  );
};
