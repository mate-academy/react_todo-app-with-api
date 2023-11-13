/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react';
import classnames from 'classnames';
import { AppContext, AppContextType } from '../Contexts/AppContextProvider';

const ErrorBanner = () => {
  const { errorMessage, setErrorMessage } = useContext(
    AppContext,
  ) as AppContextType;

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
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

export { ErrorBanner };
