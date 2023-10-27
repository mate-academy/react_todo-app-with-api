import classnames from 'classnames';
import { useEffect } from 'react';
import { useError } from '../../context/ErrorContext';

export const TodoNotification: React.FC = () => {
  const {
    errorMessage,
    isErrorHidden,
    setIsErrorHidden,
  } = useError();

  useEffect(() => {
    if (errorMessage.length) {
      setIsErrorHidden(false);
    }

    setTimeout(() => {
      setIsErrorHidden(true);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isErrorHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => setIsErrorHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
