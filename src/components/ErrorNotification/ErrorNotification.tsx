import React, { useEffect, useState } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: CallableFunction,
};

export const ErrorNotification: React.FC<Props> = React.memo((props) => {
  const { errorMessage, setErrorMessage } = props;

  const [isShowed, setIsShowed] = useState(false);
  const hideMessage = () => {
    setErrorMessage('');
    setIsShowed(false);
  };

  useEffect(() => {
    setIsShowed(true);
    setTimeout(hideMessage, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isShowed },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsShowed(false)}
      />
      {errorMessage}
    </div>
  );
});
