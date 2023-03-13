import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  errorType: string;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorType,
  setErrorType,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  const errorMessage = errorType !== 'empty title'
    ? `Unable to ${errorType} a todo`
    : 'Title can\'t be empty';

  useEffect(() => {
    const removeNotification = () => {
      window.setTimeout(() => {
        setIsHidden(true);
        setErrorType('');
      }, 3000);
    };

    if (errorType) {
      setIsHidden(false);
      removeNotification();
    } else {
      setIsHidden(true);
    }
  }, []);

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
    >
      <button
        aria-label="remove button"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
