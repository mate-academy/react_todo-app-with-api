import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../contexts/TodosContext';
import { HIDE_DELAY_ERROR } from '../../utils/constants';

export const ErrorMessage: React.FC = () => {
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const { errorMessage } = useContext(TodosContext);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (errorMessage) {
      setIsErrorHidden(false);
      timer = setTimeout(() => setIsErrorHidden(true), HIDE_DELAY_ERROR);
    } else {
      setIsErrorHidden(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  const handleErrorClose = () => {
    setIsErrorHidden(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorClose}
        aria-label="Delete"
        data-cy="HideErrorButton"
      />
      {errorMessage?.message}
    </div>
  );
};
