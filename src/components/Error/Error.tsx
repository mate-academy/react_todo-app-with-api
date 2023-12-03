/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useEffect, useState } from 'react';

import { ErrorNotification } from '../../types/ErrorNotification';
import { TodosContext } from '../../TodosContext';

export const Error = () => {
  const context = useContext(TodosContext);

  const { errorMessage, setErrorMessage } = context;

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (errorMessage !== ErrorNotification.Default) {
      setIsHidden(false);
    }

    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    !isHidden ? (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        {errorMessage}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsHidden(true)}
        />
      </div>
    ) : null
  );
};
