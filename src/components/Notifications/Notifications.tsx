import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../../types/ErrorTypes';
import { TodosContext } from '../TodosProvider';
import { GetErrorMessage } from '../../utils/GetErrorMessage';

export const Notifications: React.FC = React.memo(() => {
  const [isHidden, setIsHidden] = useState(true);
  const { errorType, errorTypeHandler } = useContext(TodosContext);
  const errorMessage = GetErrorMessage(errorType);
  let timeOutId = 0;
  const closeNotification = () => {
    timeOutId = window.setTimeout(() => {
      setIsHidden(true);
      errorTypeHandler(ErrorTypes.NONE);
    }, 3000);
  };

  useEffect(() => {
    if (errorType !== ErrorTypes.NONE) {
      window.clearTimeout(timeOutId);
      setIsHidden(false);
      closeNotification();
    } else {
      setIsHidden(true);
    }
  }, [errorType]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setIsHidden(true);
        }}
      />
      {errorMessage}
    </div>
  );
});
